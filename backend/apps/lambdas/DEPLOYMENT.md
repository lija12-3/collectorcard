# Cognito Service (sv-3) Deployment Guide

## 🚀 Best Deployment Methods for AWS Lambda

### 1. Serverless Framework (Recommended)

The **Serverless Framework** is the best choice for your Cognito service because:
- ✅ Already configured in your project
- ✅ Handles TypeScript compilation automatically
- ✅ Built-in environment variable management
- ✅ Easy IAM role configuration
- ✅ Supports multiple environments

#### Prerequisites

1. **Install Serverless Framework globally:**
   ```bash
   npm install -g serverless
   ```

2. **Configure AWS credentials:**
   ```bash
   aws configure
   # OR
   export AWS_ACCESS_KEY_ID=your_access_key
   export AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

3. **Set required environment variables:**
   ```bash
   export COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
   export COGNITO_CLIENT_ID=your_client_id
   ```

#### Deployment Commands

**Quick Deploy:**
```bash
cd backend/apps/sv-3
serverless deploy
```

**Deploy to specific environment:**
```bash
# Development
serverless deploy --stage dev

# Production
serverless deploy --stage prod --region us-west-2

# With specific AWS profile
serverless deploy --stage dev --aws-profile my-profile
```

**Using the deployment script:**
```bash
# Linux/Mac
chmod +x deploy-cognito.sh
./deploy-cognito.sh

# Windows PowerShell
.\deploy-cognito.ps1 -Stage dev -Region us-east-1
```

### 2. AWS CDK (Advanced)

For infrastructure as code approach:

```bash
npm install -g aws-cdk
cdk init app --language typescript
cdk deploy
```

### 3. AWS SAM (Alternative)

```bash
sam build
sam deploy --guided
```

## 🔧 Configuration

### Environment Variables

Required environment variables:
- `COGNITO_USER_POOL_ID` - Your Cognito User Pool ID
- `COGNITO_CLIENT_ID` - Your Cognito App Client ID
- `STAGE` - Deployment stage (dev/staging/prod)
- `AWS_REGION` - AWS region

### IAM Permissions

The service requires these IAM permissions:
- `cognito-idp:*` - Full Cognito Identity Provider access

## 📊 Monitoring & Logs

After deployment, monitor your service:

1. **CloudWatch Logs:**
   - Log Group: `/aws/lambda/sv-3-cognito-service-{stage}-cognito`

2. **API Gateway:**
   - Check API Gateway console for endpoint URLs
   - Monitor request/response metrics

3. **Lambda Metrics:**
   - Invocations, errors, duration
   - Cold start performance

## 🚨 Troubleshooting

### Common Issues:

1. **Build Errors:**
   ```bash
   npm run build
   # Check TypeScript compilation errors
   ```

2. **Permission Errors:**
   ```bash
   aws sts get-caller-identity
   # Verify AWS credentials
   ```

3. **Environment Variables:**
   ```bash
   echo $COGNITO_USER_POOL_ID
   echo $COGNITO_CLIENT_ID
   ```

4. **Serverless Plugin Issues:**
   ```bash
   npm install serverless-plugin-typescript
   ```

## 🔄 CI/CD Integration

### GitHub Actions Example:

```yaml
name: Deploy Cognito Service
on:
  push:
    branches: [main]
    paths: ['backend/apps/sv-3/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend/apps/sv-3 && npm install
      - run: cd backend/apps/sv-3 && npm run build
      - run: cd backend/apps/sv-3 && serverless deploy --stage prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          COGNITO_USER_POOL_ID: ${{ secrets.COGNITO_USER_POOL_ID }}
          COGNITO_CLIENT_ID: ${{ secrets.COGNITO_CLIENT_ID }}
```

## 📈 Performance Optimization

1. **Lambda Configuration:**
   - Memory: 512MB (adjust based on usage)
   - Timeout: 30 seconds
   - Runtime: Node.js 18.x

2. **Cold Start Optimization:**
   - Use connection pooling
   - Minimize dependencies
   - Keep Lambda warm with scheduled events

3. **API Gateway:**
   - Enable caching for GET requests
   - Use compression
   - Set appropriate throttling limits

## 🎯 Next Steps

1. Deploy the service using Serverless Framework
2. Test the endpoints
3. Set up monitoring and alerting
4. Configure CI/CD pipeline
5. Optimize performance based on usage patterns
