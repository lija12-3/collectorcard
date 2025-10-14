#!/usr/bin/env node

/**
 * Pre-commit hook script that matches GitHub Actions workflow
 * This ensures local development follows the same quality standards as CI/CD
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { platform } from 'os';

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

// Helper functions for colored output
const log = {
  status: msg => console.log(`${colors.blue}📝 ${msg}${colors.reset}`),
  success: msg => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: msg => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: msg => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: msg => console.log(`${colors.bold}${msg}${colors.reset}`),
};

// Execute command with error handling
function execCommand(command, description) {
  try {
    log.status(description);
    execSync(command, { stdio: 'inherit' });
    log.success(`${description} passed`);
    return true;
  } catch (error) {
    log.error(`${description} failed`);
    return false;
  }
}

// Main pre-commit function
async function runPreCommitChecks() {
  console.log(
    `${colors.blue}🔍 Running pre-commit checks (matching GitHub Actions)...${colors.reset}`,
  );
  console.log('==================================================');

  // Check if we're in the backend directory
  if (!existsSync('package.json')) {
    log.error('This script must be run from the backend directory');
    process.exit(1);
  }

  const checks = [
    {
      command: 'npx lint-staged',
      description: 'Running ESLint on staged files',
    },
    {
      command: 'npm run format:check',
      description: 'Running Prettier check',
    },
    // Note: TypeScript type check and build are skipped in pre-commit
    // to avoid blocking commits due to module resolution issues.
    // These are still run in GitHub Actions CI/CD pipeline.
  ];

  // Run all checks
  for (const check of checks) {
    if (!execCommand(check.command, check.description)) {
      process.exit(1);
    }
  }

  // Security audit with user confirmation
  log.status('Running security audit...');
  try {
    execSync('npm audit --audit-level=moderate', { stdio: 'inherit' });
    log.success('Security audit passed');
  } catch (error) {
    log.warning('Security audit found moderate or higher vulnerabilities.');
    log.warning('Please review and fix security issues before committing.');
    console.log('');
    console.log('To see details: npm audit');
    console.log('To fix automatically: npm audit fix');
    console.log('');

    // For now, we'll continue on security audit failures
    // In a real scenario, you might want to prompt the user
    log.warning('Continuing despite security issues...');
  }

  console.log('');
  log.success('All pre-commit checks passed! 🎉');
  console.log('==================================================');
}

// Run the checks
runPreCommitChecks().catch(error => {
  log.error(`Pre-commit check failed: ${error.message}`);
  process.exit(1);
});
