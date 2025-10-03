#!/bin/bash

# Cognito Service Deployment Script
# Deploys sv-3 cognito service to AWS Lambda

set -e

echo "🚀 Starting Cognito Service Deployment..."

# Check if required environment variables are set
if [ -z "$COGNITO_USER_POOL_ID" ]; then
    echo "❌ Error: COGNITO_USER_POOL_ID environment variable is required"
    exit 1
fi

if [ -z "$COGNITO_CLIENT_ID" ]; then
    echo "❌ Error: COGNITO_CLIENT_ID environment variable is required"
    exit 1
fi

# Set default values
STAGE=${STAGE:-dev}
REGION=${AWS_REGION:-us-east-1}

echo "📋 Deployment Configuration:"
echo "   Stage: $STAGE"
echo "   Region: $REGION"
echo "   User Pool ID: $COGNITO_USER_POOL_ID"
echo "   Client ID: $COGNITO_CLIENT_ID"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy using serverless
echo "🚀 Deploying to AWS Lambda..."
serverless deploy --stage $STAGE --region $REGION

echo "✅ Cognito service deployed successfully!"
echo "🌐 Service endpoints:"
echo "   - API Gateway URL: Check AWS Console"
echo "   - Lambda Function: sv-3-cognito-service-$STAGE-cognito"
