#!/usr/bin/env node

/**
 * Lightweight pre-commit hook - only checks build/run
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

// Helper functions for colored output
const log = {
  status: msg => console.log(`${colors.blue}📝 ${msg}${colors.reset}`),
  success: msg => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: msg => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
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
    `${colors.blue}🔍 Running lightweight pre-commit checks...${colors.reset}`,
  );
  console.log('==================================================');

  // Check if we're in the backend directory
  if (!existsSync('package.json')) {
    log.error('This script must be run from the backend directory');
    process.exit(1);
  }

  // Only run build check
  const checks = [
    {
      command: 'npm run build:api',
      description: 'Building API',
    },
  ];

  // Run all checks
  for (const check of checks) {
    if (!execCommand(check.command, check.description)) {
      process.exit(1);
    }
  }

  console.log('');
  log.success('Pre-commit checks passed! 🎉');
  console.log('==================================================');
}

// Run the checks
runPreCommitChecks().catch(error => {
  log.error(`Pre-commit check failed: ${error.message}`);
  process.exit(1);
});
