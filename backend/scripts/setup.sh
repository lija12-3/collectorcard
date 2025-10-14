#!/bin/bash

# Setup script for Collectors Card Backend
echo "🚀 Setting up Collectors Card Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup Husky
echo "🐕 Setting up Husky..."
npx husky install

# Make Husky hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg

# Run initial linting
echo "🔍 Running initial linting..."
npm run lint:check

# Run type checking
echo "🔍 Running type checking..."
npm run type-check

# Build API
echo "🏗️ Building API..."
npm run build:api

echo "✅ Setup complete!"
echo ""
echo "Available commands:"
echo "  npm run lint          - Run ESLint with auto-fix"
echo "  npm run lint:check     - Run ESLint without auto-fix"
echo "  npm run format         - Format code with Prettier"
echo "  npm run format:check   - Check code formatting"
echo "  npm run type-check     - Run TypeScript type checking"
echo "  npm run build:api      - Build API application"
echo "  npm run start:api:dev  - Start API in development mode"
echo ""
echo "Pre-commit hooks are now active!"
echo "Your code will be automatically linted and formatted before each commit."
