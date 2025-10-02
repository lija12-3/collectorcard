#!/usr/bin/env node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Cardinal Build Script
 * Builds all libraries and services for deployment
 */

const CARDINAL_ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(CARDINAL_ROOT, 'dist');

interface BuildConfig {
  libraries: string[];
  services: string[];
  clean: boolean;
  parallel: boolean;
}

const buildConfig: BuildConfig = {
  libraries: [
    'auth',
    'database',
    'logger',
    'aws-keystore',
    'aws-sqs',
    'aws-ses',
    'aws-sns',
    'third-party',
    'bff-utils',
  ],
  services: [
    'user-service',
    'payment-service',
    'notification-service',
    'content-service',
    'analytics-service',
    'bff-service',
  ],
  clean: true,
  parallel: true,
};

function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '🔧',
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

function cleanDist(): void {
  if (fs.existsSync(DIST_DIR)) {
    log('Cleaning dist directory...', 'info');
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

function buildLibrary(libName: string): void {
  const libPath = path.join(CARDINAL_ROOT, 'libs', libName);
  
  if (!fs.existsSync(libPath)) {
    log(`Library not found: ${libName}`, 'warn');
    return;
  }

  log(`Building library: ${libName}`, 'info');
  
  try {
    // Install dependencies
    runCommand('npm install', libPath);
    
    // Build library
    runCommand('npm run build', libPath);
    
    log(`Library built successfully: ${libName}`, 'success');
  } catch (error) {
    log(`Failed to build library: ${libName}`, 'error');
    throw error;
  }
}

function buildService(serviceName: string): void {
  const servicePath = path.join(CARDINAL_ROOT, 'services', serviceName);
  
  if (!fs.existsSync(servicePath)) {
    log(`Service not found: ${serviceName}`, 'warn');
    return;
  }

  log(`Building service: ${serviceName}`, 'info');
  
  try {
    // Install dependencies
    runCommand('npm install', servicePath);
    
    // Build service
    runCommand('npm run build', servicePath);
    
    log(`Service built successfully: ${serviceName}`, 'success');
  } catch (error) {
    log(`Failed to build service: ${serviceName}`, 'error');
    throw error;
  }
}

function buildMainIndex(): void {
  log('Building main Cardinal index...', 'info');
  
  try {
    // Build main src
    runCommand('npx tsc src/index.ts --outDir dist --declaration --declarationMap');
    
    log('Main Cardinal index built successfully', 'success');
  } catch (error) {
    log('Failed to build main Cardinal index', 'error');
    throw error;
  }
}

function generatePackageJson(): void {
  log('Generating package.json for distribution...', 'info');
  
  const packageJson = {
    name: '@cardinal/platform',
    version: '1.0.0',
    description: 'Cardinal Platform - Microservices Architecture',
    main: 'index.js',
    types: 'index.d.ts',
    files: ['dist/**/*', 'libs/**/*', 'services/**/*'],
    scripts: {
      build: 'node scripts/build.js',
      deploy: 'node scripts/deploy.js',
      'index-cti': 'node scripts/index-cti.js',
    },
    dependencies: {
      '@nestjs/common': '^10.0.0',
      '@nestjs/core': '^10.0.0',
      'aws-sdk': '^2.1500.0',
      'serverless': '^3.35.0',
    },
    peerDependencies: {
      '@nestjs/common': '^10.0.0',
      '@nestjs/core': '^10.0.0',
    },
  };
  
  fs.writeFileSync(
    path.join(DIST_DIR, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  log('Package.json generated successfully', 'success');
}

async function buildAll(): Promise<void> {
  try {
    log('Starting Cardinal build process...', 'info');
    
    if (buildConfig.clean) {
      cleanDist();
    }
    
    // Build libraries
    log('Building libraries...', 'info');
    for (const lib of buildConfig.libraries) {
      buildLibrary(lib);
    }
    
    // Build services
    log('Building services...', 'info');
    for (const service of buildConfig.services) {
      buildService(service);
    }
    
    // Build main index
    buildMainIndex();
    
    // Generate package.json
    generatePackageJson();
    
    // Run index-cti
    log('Generating TypeScript interfaces...', 'info');
    runCommand('npm run index-cti');
    
    log('🎉 Cardinal build completed successfully!', 'success');
    log(`Build output: ${DIST_DIR}`, 'info');
    
  } catch (error) {
    log('Build failed!', 'error');
    process.exit(1);
  }
}

// Run build if called directly
if (require.main === module) {
  buildAll();
}

export { buildAll, buildLibrary, buildService };
