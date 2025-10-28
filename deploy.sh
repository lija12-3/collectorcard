#!/usr/bin/env bash
set -euo pipefail

CONFIG_FILE="infra/.aws/config.json"
ENVIRONMENT=${1:-}

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: ./deploy.sh [shared-services|development]"
  exit 1
fi

# require jq
if ! command -v jq &> /dev/null; then
  echo "❌ jq is not installed. Install jq (choco, brew, apt) and re-run."
  exit 1
fi

# Read basic fields
REGION=$(jq -r '.region' "$CONFIG_FILE")
PROFILE=$(jq -r ".environments[\"$ENVIRONMENT\"].Profile" "$CONFIG_FILE")
RAW_STACK_NAME=$(jq -r ".environments[\"$ENVIRONMENT\"].StackName" "$CONFIG_FILE")

if [ "$PROFILE" == "null" ] || [ "$RAW_STACK_NAME" == "null" ]; then
  echo "❌ Environment '$ENVIRONMENT' not found in $CONFIG_FILE"
  exit 1
fi

# --- Add standardized project prefix ---
PROJECT_PREFIX="card-collectors"
STACK_NAME="${PROJECT_PREFIX}-${RAW_STACK_NAME}"
# --------------------------------------

# --- Verify that the SSO profile is logged in ---
if ! aws sts get-caller-identity --profile "$PROFILE" >/dev/null 2>&1; then
  echo "🔑 SSO session for profile '$PROFILE' is expired or missing."
  echo "👉 Opening AWS SSO login..."
  aws sso login --profile "$PROFILE"
  echo "✅ SSO session refreshed for profile '$PROFILE'."
fi
# ------------------------------------------------

# Build parameter lines using jq to avoid shell-splitting issues.
mapfile -t PARAMS_ARRAY < <(
  jq -r --arg env "$ENVIRONMENT" '
    .environments[$env].Parameters
    | to_entries
    | map(select(.value != null) | ("ParameterKey=\(.key),ParameterValue=\(.value|tostring)"))
    | .[]
  ' "$CONFIG_FILE"
)

# Trim whitespace (remove stray CR/LF characters that can appear on Windows)
for i in "${!PARAMS_ARRAY[@]}"; do
  PARAMS_ARRAY[$i]=$(echo "${PARAMS_ARRAY[$i]}" | tr -d '\r' | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
done

# Debug output
echo "DEBUG → Parameters being sent to CloudFormation:"
printf '  %s\n' "${PARAMS_ARRAY[@]}"
echo "🧩 Stack name: $STACK_NAME"
echo "🧩 Profile: $PROFILE"
echo "🧩 Region: $REGION"

# Detect if stack exists
STACK_EXISTS=false
if aws cloudformation describe-stacks --stack-name "$STACK_NAME" --profile "$PROFILE" --region "$REGION" >/dev/null 2>&1; then
  STACK_EXISTS=true
fi

if [ "$STACK_EXISTS" = true ]; then
  echo "🔁 Updating existing stack: $STACK_NAME (if there are changes)"
  if aws cloudformation update-stack \
      --stack-name "$STACK_NAME" \
      --template-body file://infra/templates/backend-pipeline-stack.yaml \
      --parameters "${PARAMS_ARRAY[@]}" \
      --capabilities CAPABILITY_NAMED_IAM \
      --region "$REGION" \
      --profile "$PROFILE"; then
    aws cloudformation wait stack-update-complete --stack-name "$STACK_NAME" --region "$REGION" --profile "$PROFILE"
    echo "✅ Stack '$STACK_NAME' updated successfully."
  else
    echo "ℹ️ No updates to be performed (or update failed)."
  fi
else
  echo "🚀 Creating new stack: $STACK_NAME in environment: $ENVIRONMENT"
  aws cloudformation create-stack \
    --stack-name "$STACK_NAME" \
    --template-body file://infra/templates/backend-pipeline-stack.yaml \
    --parameters "${PARAMS_ARRAY[@]}" \
    --capabilities CAPABILITY_NAMED_IAM \
    --region "$REGION" \
    --profile "$PROFILE"

  echo "⏳ Waiting for stack creation to complete..."
  aws cloudformation wait stack-create-complete --stack-name "$STACK_NAME" --region "$REGION" --profile "$PROFILE"
  echo "✅ Stack '$STACK_NAME' created successfully."
fi
