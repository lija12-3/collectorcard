#!/bin/bash
set -e

STACK_NAME="shared-artifacts-stack"
PROFILE="shared-services"
REGION="us-east-1"

echo "🚀 Deploying Shared Artifacts Stack ($STACK_NAME) in Shared Services Account..."

aws cloudformation deploy \
  --stack-name $STACK_NAME \
  --template-file ../templates/shared-artifacts-stack.yaml \
  --parameters
    file://../parameters/shared-params.json \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE

echo "✅ Shared Artifacts Stack deployed successfully."

aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --profile $PROFILE \
  --query "Stacks[0].Outputs" --output table
