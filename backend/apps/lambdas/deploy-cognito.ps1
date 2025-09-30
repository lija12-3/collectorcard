# Cognito Service Deployment Script (PowerShell)
# Deploys sv-3 cognito service to AWS Lambda

param(
    [string]$Stage = "dev",
    [string]$Region = "us-east-1"
)

Write-Host "🚀 Starting Cognito Service Deployment..." -ForegroundColor Green

# Check if required environment variables are set
if (-not $env:COGNITO_USER_POOL_ID) {
    Write-Host "❌ Error: COGNITO_USER_POOL_ID environment variable is required" -ForegroundColor Red
    exit 1
}

if (-not $env:COGNITO_CLIENT_ID) {
    Write-Host "❌ Error: COGNITO_CLIENT_ID environment variable is required" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Deployment Configuration:" -ForegroundColor Yellow
Write-Host "   Stage: $Stage" -ForegroundColor White
Write-Host "   Region: $Region" -ForegroundColor White
Write-Host "   User Pool ID: $env:COGNITO_USER_POOL_ID" -ForegroundColor White
Write-Host "   Client ID: $env:COGNITO_CLIENT_ID" -ForegroundColor White

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Blue
npm run build

# Deploy using serverless
Write-Host "🚀 Deploying to AWS Lambda..." -ForegroundColor Blue
serverless deploy --stage $Stage --region $Region

Write-Host "✅ Cognito service deployed successfully!" -ForegroundColor Green
Write-Host "🌐 Service endpoints:" -ForegroundColor Yellow
Write-Host "   - API Gateway URL: Check AWS Console" -ForegroundColor White
Write-Host "   - Lambda Function: sv-3-cognito-service-$Stage-cognito" -ForegroundColor White
