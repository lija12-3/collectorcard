#!/bin/bash

# Pre-commit hook script that matches GitHub Actions workflow
# This ensures local development follows the same quality standards as CI/CD

set -e  # Exit on any error

echo "🔍 Running pre-commit checks (matching GitHub Actions)..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}📝 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the backend directory"
    exit 1
fi

# 1. Run ESLint (with fix for staged files)
print_status "Running ESLint on staged files..."
if npx lint-staged; then
    print_success "ESLint passed"
else
    print_error "ESLint failed. Please fix the issues and try again."
    exit 1
fi

# 2. Run Prettier check
print_status "Running Prettier check..."
if npm run format:check; then
    print_success "Prettier check passed"
else
    print_error "Prettier check failed. Run 'npm run format' to fix formatting issues."
    exit 1
fi

# 3. Run TypeScript type check
print_status "Running TypeScript type check..."
if npm run type-check; then
    print_success "TypeScript type check passed"
else
    print_error "TypeScript type check failed. Please fix type errors and try again."
    exit 1
fi

# 4. Build API application
print_status "Building API application..."
if npm run build:api; then
    print_success "API build successful"
else
    print_error "API build failed. Please fix build errors and try again."
    exit 1
fi

# 5. Security audit (only for moderate+ vulnerabilities)
print_status "Running security audit..."
if npm audit --audit-level=moderate; then
    print_success "Security audit passed"
else
    print_warning "Security audit found moderate or higher vulnerabilities."
    print_warning "Please review and fix security issues before committing."
    echo ""
    echo "To see details: npm audit"
    echo "To fix automatically: npm audit fix"
    echo ""
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Commit cancelled due to security issues."
        exit 1
    fi
fi

echo ""
print_success "All pre-commit checks passed! 🎉"
echo "=================================================="
