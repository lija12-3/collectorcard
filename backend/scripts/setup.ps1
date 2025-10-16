# Setup script for Collectors Card Backend
Write-Host "🚀 Setting up Collectors Card Backend..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check Node.js version
$version = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($version -lt 18) {
    Write-Host "❌ Node.js version 18+ is required. Current version: $nodeVersion" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Setup Husky
Write-Host "🐕 Setting up Husky..." -ForegroundColor Yellow
npx husky install

# Run initial linting
Write-Host "🔍 Running initial linting..." -ForegroundColor Yellow
npm run lint:check

# Run type checking
Write-Host "🔍 Running type checking..." -ForegroundColor Yellow
npm run type-check

# Build API
Write-Host "🏗️ Building API..." -ForegroundColor Yellow
npm run build:api

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  npm run lint          - Run ESLint with auto-fix" -ForegroundColor White
Write-Host "  npm run lint:check     - Run ESLint without auto-fix" -ForegroundColor White
Write-Host "  npm run format         - Format code with Prettier" -ForegroundColor White
Write-Host "  npm run format:check   - Check code formatting" -ForegroundColor White
Write-Host "  npm run type-check     - Run TypeScript type checking" -ForegroundColor White
Write-Host "  npm run build:api      - Build API application" -ForegroundColor White
Write-Host "  npm run start:api:dev  - Start API in development mode" -ForegroundColor White
Write-Host ""
Write-Host "Pre-commit hooks are now active!" -ForegroundColor Green
Write-Host "Your code will be automatically linted and formatted before each commit." -ForegroundColor Green
