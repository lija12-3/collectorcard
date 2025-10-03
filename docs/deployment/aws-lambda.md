# AWS Lambda Deployment Guide

This guide covers deploying the Cardinal platform to AWS Lambda using the Serverless Framework.

## Prerequisites

### 1. AWS Account Setup

- Create an AWS account
- Set up IAM user with appropriate permissions
- Configure AWS CLI

### 2. Required Tools

```bash
# Install Node.js 18+
node --version

# Install Serverless Framework
npm install -g serverless

# Install AWS CLI
aws --version

# Install Docker (for local testing)
docker --version
```

### 3. AWS CLI Configuration

```bash
# Configure AWS credentials
aws configure

# Test configuration
aws sts get-caller-identity
```

## Environment Setup

### 1. Environment Variables

Create environment-specific configuration files:

**`.env.dev`**
```env
NODE_ENV=development
STAGE=dev
AWS_REGION=us-east-1

# Database
DB_HOST=your-dev-db-host
DB_USERNAME=cardinal_dev
DB_PASSWORD=your-dev-password
DB_DATABASE=cardinal_dev

# Authentication
JWT_SECRET=your-dev-jwt-secret
ENCRYPTION_KEY=your-dev-encryption-key

# AWS Services
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/account/queue
SES_FROM_EMAIL=noreply@dev.yourdomain.com
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:account:topic
```

**`.env.staging`**
```env
NODE_ENV=staging
STAGE=staging
AWS_REGION=us-east-1

# Database
DB_HOST=your-staging-db-host
DB_USERNAME=cardinal_staging
DB_PASSWORD=your-staging-password
DB_DATABASE=cardinal_staging

# Authentication
JWT_SECRET=your-staging-jwt-secret
ENCRYPTION_KEY=your-staging-encryption-key

# AWS Services
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/account/staging-queue
SES_FROM_EMAIL=noreply@staging.yourdomain.com
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:account/staging-topic
```

**`.env.prod`**
```env
NODE_ENV=production
STAGE=prod
AWS_REGION=us-east-1

# Database
DB_HOST=your-prod-db-host
DB_USERNAME=cardinal_prod
DB_PASSWORD=your-prod-password
DB_DATABASE=cardinal_prod

# Authentication
JWT_SECRET=your-prod-jwt-secret
ENCRYPTION_KEY=your-prod-encryption-key

# AWS Services
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/account/prod-queue
SES_FROM_EMAIL=noreply@yourdomain.com
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:account/prod-topic
```

### 2. AWS Resources Setup

#### RDS Database

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier cardinal-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username cardinal \
  --master-user-password your-password \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-12345678
```

#### ElastiCache Redis

```bash
# Create ElastiCache cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id cardinal-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

#### SQS Queues

```bash
# Create SQS queues
aws sqs create-queue --queue-name cardinal-payments-dev
aws sqs create-queue --queue-name cardinal-notifications-dev
aws sqs create-queue --queue-name cardinal-analytics-dev
```

#### SES Configuration

```bash
# Verify email addresses
aws ses verify-email-identity --email-address noreply@yourdomain.com
aws ses verify-email-identity --email-address admin@yourdomain.com
```

## Deployment Process

### 1. Build and Deploy All Services

```bash
# Build all services
npm run build

# Deploy all services
npm run deploy

# Deploy to specific stage
npm run deploy -- --stage staging

# Deploy specific service
npm run deploy:service -- user-service --stage prod
```

### 2. Individual Service Deployment

```bash
# Deploy user service
cd services/user-service
serverless deploy --stage dev

# Deploy payment service
cd services/payment-service
serverless deploy --stage dev

# Deploy notification service
cd services/notification-service
serverless deploy --stage dev

# Deploy BFF service
cd services/bff-service
serverless deploy --stage dev
```

### 3. Environment-Specific Deployment

```bash
# Development
npm run deploy:dev

# Staging
npm run deploy:staging

# Production
npm run deploy:prod
```

## Configuration Management

### 1. Serverless Configuration

Each service has its own `serverless.yml`:

```yaml
service: cardinal-user-service

provider:
  name: aws
  runtime: nodejs18.x
  stage: ${opt:stage, 'dev'}
  region: ${opt:region, 'us-east-1'}
  memorySize: 512
  timeout: 30
  environment:
    NODE_ENV: ${self:provider.stage}
    JWT_SECRET: ${env:JWT_SECRET}
    DB_HOST: ${env:DB_HOST}
    # ... other environment variables

functions:
  userService:
    handler: dist/main.lambda.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
```

### 2. Environment-Specific Configuration

```yaml
# serverless.yml
custom:
  stages:
    dev:
      memorySize: 512
      timeout: 30
    staging:
      memorySize: 1024
      timeout: 60
    prod:
      memorySize: 2048
      timeout: 120

provider:
  memorySize: ${self:custom.stages.${self:provider.stage}.memorySize}
  timeout: ${self:custom.stages.${self:provider.stage}.timeout}
```

## Monitoring and Logging

### 1. CloudWatch Logs

```bash
# View logs for specific service
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/cardinal

# View recent logs
aws logs tail /aws/lambda/cardinal-user-service-dev-userService --follow
```

### 2. CloudWatch Metrics

```bash
# View metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=cardinal-user-service-dev-userService \
  --start-time 2023-01-01T00:00:00Z \
  --end-time 2023-01-02T00:00:00Z \
  --period 3600 \
  --statistics Average
```

### 3. Custom Metrics

```typescript
// In your service
import { CloudWatch } from 'aws-sdk';

const cloudwatch = new CloudWatch();

// Send custom metric
await cloudwatch.putMetricData({
  Namespace: 'Cardinal/UserService',
  MetricData: [{
    MetricName: 'UserCreated',
    Value: 1,
    Unit: 'Count',
    Timestamp: new Date()
  }]
}).promise();
```

## Security Configuration

### 1. IAM Roles and Policies

```yaml
# serverless.yml
provider:
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - rds:DescribeDBInstances
            - rds:Connect
          Resource: "*"
        - Effect: Allow
          Action:
            - sqs:SendMessage
            - sqs:ReceiveMessage
            - sqs:DeleteMessage
          Resource: 
            - "arn:aws:sqs:${aws:region}:${aws:accountId}:cardinal-*"
        - Effect: Allow
          Action:
            - ses:SendEmail
            - ses:SendRawEmail
          Resource: "*"
```

### 2. VPC Configuration

```yaml
# serverless.yml
provider:
  vpc:
    securityGroupIds:
      - sg-12345678
    subnetIds:
      - subnet-12345678
      - subnet-87654321
```

### 3. Environment Variables Security

```yaml
# Use AWS Systems Manager Parameter Store
provider:
  environment:
    JWT_SECRET: ${ssm:/cardinal/${self:provider.stage}/jwt-secret}
    DB_PASSWORD: ${ssm:/cardinal/${self:provider.stage}/db-password~true}
```

## Database Migrations

### 1. Migration Script

```typescript
// scripts/migrate.ts
import { createConnection } from 'typeorm';
import { config } from 'dotenv';

config();

async function migrate() {
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../dist/entities/*.js'],
    migrations: [__dirname + '/../dist/migrations/*.js'],
  });

  await connection.runMigrations();
  await connection.close();
}

migrate().catch(console.error);
```

### 2. Run Migrations

```bash
# Run migrations
npm run migrate

# Run migrations for specific environment
NODE_ENV=production npm run migrate
```

## CI/CD Pipeline

### 1. GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS Lambda

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build
      
    - name: Deploy to AWS
      if: github.ref == 'refs/heads/main'
      run: npm run deploy:prod
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### 2. Environment-Specific Deployment

```yaml
# Deploy to staging on develop branch
- name: Deploy to Staging
  if: github.ref == 'refs/heads/develop'
  run: npm run deploy:staging
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

# Deploy to production on main branch
- name: Deploy to Production
  if: github.ref == 'refs/heads/main'
  run: npm run deploy:prod
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Troubleshooting

### 1. Common Issues

#### Deployment Failures

```bash
# Check deployment status
serverless info --stage dev

# View deployment logs
serverless logs --function userService --stage dev

# Rollback deployment
serverless rollback --timestamp 1234567890 --stage dev
```

#### Function Timeouts

```yaml
# Increase timeout in serverless.yml
provider:
  timeout: 60  # seconds
```

#### Memory Issues

```yaml
# Increase memory allocation
provider:
  memorySize: 1024  # MB
```

#### Cold Start Issues

```typescript
// Use provisioned concurrency
functions:
  userService:
    handler: dist/main.lambda.handler
    provisionedConcurrency: 2
```

### 2. Debugging

```bash
# Local testing with serverless-offline
serverless offline --stage dev

# Debug mode
DEBUG=* serverless deploy --stage dev

# Verbose logging
serverless deploy --stage dev --verbose
```

### 3. Performance Optimization

```typescript
// Connection pooling
const connection = await createConnection({
  // ... other config
  extra: {
    max: 20, // Maximum number of connections
    min: 5,  // Minimum number of connections
    idleTimeoutMillis: 30000,
  }
});

// Caching
import { Cache } from 'cache-manager';
import { redisStore } from 'cache-manager-redis-store';

const cache = Cache({
  store: redisStore,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
```

## Cost Optimization

### 1. Right-Sizing Functions

```yaml
# Start with minimal resources
provider:
  memorySize: 256
  timeout: 30

# Monitor and adjust based on usage
```

### 2. Reserved Concurrency

```yaml
# Limit concurrent executions
functions:
  userService:
    handler: dist/main.lambda.handler
    reservedConcurrency: 10
```

### 3. Dead Letter Queues

```yaml
# Handle failed executions
functions:
  userService:
    handler: dist/main.lambda.handler
    deadLetter:
      targetArn: arn:aws:sqs:region:account:dlq
```

## Monitoring and Alerting

### 1. CloudWatch Alarms

```bash
# Create alarm for high error rate
aws cloudwatch put-metric-alarm \
  --alarm-name "Cardinal-High-Error-Rate" \
  --alarm-description "High error rate in Cardinal functions" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

### 2. Custom Dashboards

```bash
# Create CloudWatch dashboard
aws cloudwatch put-dashboard \
  --dashboard-name "Cardinal-Platform" \
  --dashboard-body file://dashboard.json
```

## Backup and Recovery

### 1. Database Backups

```bash
# Create RDS snapshot
aws rds create-db-snapshot \
  --db-instance-identifier cardinal-db \
  --db-snapshot-identifier cardinal-db-backup-$(date +%Y%m%d)
```

### 2. Function Versioning

```bash
# Deploy with version
serverless deploy --stage prod --version 1.0.0

# List versions
serverless deploy list --stage prod
```

### 3. Rollback Strategy

```bash
# Rollback to previous version
serverless rollback --timestamp 1234567890 --stage prod

# Deploy specific version
serverless deploy --stage prod --version 1.0.0
```
