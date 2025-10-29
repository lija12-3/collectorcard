#!/usr/bin/env bash
set -euo pipefail

CONFIG_FILE="infra/.aws/config.json"
ENVIRONMENT=${1:-}

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: ./bootstrap-add-eks-role.sh [shared-services|development]"
  exit 1
fi

# --- Require jq ---
if ! command -v jq &>/dev/null; then
  echo "❌ jq is not installed. Install jq and re-run."
  exit 1
fi

# --- Read fields from config file ---
REGION=$(jq -r '.region' "$CONFIG_FILE")
PROFILE=$(jq -r ".environments[\"$ENVIRONMENT\"].Profile" "$CONFIG_FILE")
RAW_STACK_NAME=$(jq -r ".environments[\"$ENVIRONMENT\"].StackName" "$CONFIG_FILE")

if [ "$PROFILE" == "null" ] || [ "$RAW_STACK_NAME" == "null" ]; then
  echo "❌ Environment '$ENVIRONMENT' not found in $CONFIG_FILE"
  exit 1
fi

PROJECT_PREFIX="card-collectors"
STACK_NAME="${RAW_STACK_NAME}"

echo "🧩 Selected environment: $ENVIRONMENT"
echo "🧩 Profile: $PROFILE"
echo "🧩 Region: $REGION"
echo "🧩 Stack: $STACK_NAME"

# --- Verify AWS SSO session ---
if ! aws sts get-caller-identity --profile "$PROFILE" >/dev/null 2>&1; then
  echo "🔑 SSO session for profile '$PROFILE' is expired or missing."
  aws sso login --profile "$PROFILE"
  echo "✅ SSO session refreshed for profile '$PROFILE'."
fi

# ------------------------------
# ✅ Only run bootstrap in development
# ------------------------------
if [ "$ENVIRONMENT" != "development" ]; then
  echo "⚠️ This script is only valid for the 'development' environment (EKS cluster lives there)."
  exit 0
fi

# ------------------------------
# Configuration values
# ------------------------------
EKS_CLUSTER_NAME="dev-eks-fargate-cluster"
DEPLOY_ROLE_NAME="card-collectors-backend-deploy-role"

echo "🔍 Retrieving Deploy Role ARN..."
DEPLOY_ROLE_ARN=$(aws iam get-role --role-name "$DEPLOY_ROLE_NAME" \
  --query "Role.Arn" --output text --profile "$PROFILE" --region "$REGION")

echo "✅ Found role ARN: $DEPLOY_ROLE_ARN"

# ------------------------------
# Update kubeconfig
# ------------------------------
echo "🔧 Updating kubeconfig for cluster: $EKS_CLUSTER_NAME"
aws eks update-kubeconfig --name "$EKS_CLUSTER_NAME" --region "$REGION" --profile "$PROFILE"

# ------------------------------
# Fetch and update aws-auth ConfigMap
# ------------------------------
echo "📦 Fetching existing aws-auth ConfigMap..."
kubectl get configmap aws-auth -n kube-system -o yaml > aws-auth.yaml

if grep -q "$DEPLOY_ROLE_ARN" aws-auth.yaml; then
  echo "✅ Role $DEPLOY_ROLE_ARN already exists in aws-auth. Skipping addition."
else
  echo "➕ Adding role to aws-auth ConfigMap..."
  cp aws-auth.yaml aws-auth-backup-$(date +%s).yaml

  # Append new role mapping
  cat <<EOF >> aws-auth.yaml
  - rolearn: ${DEPLOY_ROLE_ARN}
    username: deploy-role
    groups:
      - system:masters
EOF

  # Apply changes
  kubectl apply -f aws-auth.yaml -n kube-system
  echo "✅ Successfully added $DEPLOY_ROLE_ARN to aws-auth ConfigMap."
fi

# ------------------------------
# Verify access
# ------------------------------
echo "⏳ Verifying EKS access using deploy role..."
aws eks update-kubeconfig --name "$EKS_CLUSTER_NAME" --region "$REGION" --role-arn "$DEPLOY_ROLE_ARN" --profile "$PROFILE"

echo "🚀 Checking namespaces..."
kubectl get ns

echo "✅ Bootstrap complete. The deploy role now has EKS cluster admin access."
