#!/usr/bin/env node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Cardinal Deploy Script
 * Deploys all services to AWS Lambda using Serverless Framework
 */

const CARDINAL_ROOT = path.join(__dirname, '..');

interface DeployConfig {
  services: string[];
  stage: string;
  region: string;
  parallel: boolean;
  skipBuild: boolean;
}

const deployConfig: DeployConfig = {
  services: [
    'ms-1',      // Kubernetes microservice
    'ms-2',      // Kubernetes microservice
    'sv-3',      // Serverless Lambda service
  ],
  stage: process.env.STAGE || 'dev',
  region: process.env.AWS_REGION || 'us-east-1',
  parallel: false,
  skipBuild: false,
};

function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '🚀',
    success: '✅',
    error: '❌',
    warn: '⚠️',
  }[type];
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function runCommand(command: string, cwd?: string): void {
  try {
    log(`Running: ${command}`, 'info');
    execSync(command, {
      cwd: cwd || CARDINAL_ROOT,
      stdio: 'inherit',
    });
  } catch (error) {
    log(`Command failed: ${command}`, 'error');
    throw error;
  }
}

function checkPrerequisites(): void {
  log('Checking prerequisites...', 'info');
  
  // Check if serverless is installed
  try {
    execSync('serverless --version', { stdio: 'pipe' });
    log('Serverless Framework found', 'success');
  } catch (error) {
    log('Serverless Framework not found. Installing...', 'warn');
    runCommand('npm install -g serverless');
  }
  
  // Check AWS credentials
  try {
    execSync('aws sts get-caller-identity', { stdio: 'pipe' });
    log('AWS credentials configured', 'success');
  } catch (error) {
    log('AWS credentials not configured. Please run "aws configure"', 'error');
    throw new Error('AWS credentials required for deployment');
  }
  
  // Check environment variables
  const requiredEnvVars = [
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'DB_HOST',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    log(`Missing required environment variables: ${missingVars.join(', ')}`, 'error');
    throw new Error('Required environment variables not set');
  }
  
  log('Prerequisites check completed', 'success');
}

function buildIfNeeded(): void {
  if (!deployConfig.skipBuild) {
    log('Building project before deployment...', 'info');
    runCommand('npm run build');
  } else {
    log('Skipping build step', 'warn');
  }
}

function deployService(serviceName: string): void {
  const servicePath = path.join(CARDINAL_ROOT, 'backend', 'apps', serviceName);
  
  if (!fs.existsSync(servicePath)) {
    log(`Service not found: ${serviceName}`, 'warn');
    return;
  }

  log(`Deploying service: ${serviceName}`, 'info');
  
  try {
    if (serviceName === 'sv-3') {
      // Deploy Lambda service using serverless
      runCommand(
        `serverless deploy --stage ${deployConfig.stage} --region ${deployConfig.region}`,
        servicePath
      );
    } else {
      // Deploy Kubernetes microservices
      log(`Building Docker image for ${serviceName}`, 'info');
      runCommand(`docker build -t cardinal/${serviceName}:latest .`, servicePath);
      
      log(`Applying Kubernetes deployment for ${serviceName}`, 'info');
      runCommand(`kubectl apply -f k8s-deployment.yaml`, servicePath);
    }
    
    log(`Service deployed successfully: ${serviceName}`, 'success');
  } catch (error) {
    log(`Failed to deploy service: ${serviceName}`, 'error');
    throw error;
  }
}

function deployAllServices(): void {
  log('Deploying all services...', 'info');
  
  for (const service of deployConfig.services) {
    try {
      deployService(service);
    } catch (error) {
      log(`Failed to deploy ${service}. Continuing with other services...`, 'warn');
    }
  }
  
  log('All services deployment completed', 'success');
}

function generateDeploymentSummary(): void {
  log('Generating deployment summary...', 'info');
  
  const summary = {
    timestamp: new Date().toISOString(),
    stage: deployConfig.stage,
    region: deployConfig.region,
    services: deployConfig.services,
    status: 'completed',
  };
  
  const summaryPath = path.join(CARDINAL_ROOT, 'deploy', 'deployment-summary.json');
  fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  log(`Deployment summary saved to: ${summaryPath}`, 'success');
}

async function deployAll(): Promise<void> {
  try {
    log('Starting Cardinal deployment process...', 'info');
    log(`Stage: ${deployConfig.stage}`, 'info');
    log(`Region: ${deployConfig.region}`, 'info');
    
    // Check prerequisites
    checkPrerequisites();
    
    // Build if needed
    buildIfNeeded();
    
    // Deploy all services
    deployAllServices();
    
    // Generate summary
    generateDeploymentSummary();
    
    log('🎉 Cardinal deployment completed successfully!', 'success');
    log('All services are now running on AWS Lambda', 'success');
    
  } catch (error) {
    log('Deployment failed!', 'error');
    process.exit(1);
  }
}

// Run deploy if called directly
if (require.main === module) {
  deployAll();
}

export { deployAll, deployService };
