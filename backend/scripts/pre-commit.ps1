# Pre-commit hook script that matches GitHub Actions workflow
# This ensures local development follows the same quality standards as CI/CD

param(
    [switch]$SkipSecurityAudit
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "🔍 Running pre-commit checks (matching GitHub Actions)..." -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Blue

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "📝 $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Check if we're in the backend directory
if (-not (Test-Path "package.json")) {
    Write-Error "This script must be run from the backend directory"
    exit 1
}

try {
    # 1. Run ESLint (with fix for staged files)
    Write-Status "Running ESLint on staged files..."
    npx lint-staged
    if ($LASTEXITCODE -eq 0) {
        Write-Success "ESLint passed"
    } else {
        Write-Error "ESLint failed. Please fix the issues and try again."
        exit 1
    }

    # 2. Run Prettier check
    Write-Status "Running Prettier check..."
    npm run format:check
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Prettier check passed"
    } else {
        Write-Error "Prettier check failed. Run 'npm run format' to fix formatting issues."
        exit 1
    }

    # 3. Run TypeScript type check
    Write-Status "Running TypeScript type check..."
    npm run type-check
    if ($LASTEXITCODE -eq 0) {
        Write-Success "TypeScript type check passed"
    } else {
        Write-Error "TypeScript type check failed. Please fix type errors and try again."
        exit 1
    }

    # 4. Build API application
    Write-Status "Building API application..."
    npm run build:api
    if ($LASTEXITCODE -eq 0) {
        Write-Success "API build successful"
    } else {
        Write-Error "API build failed. Please fix build errors and try again."
        exit 1
    }

    # 5. Security audit (only for moderate+ vulnerabilities)
    if (-not $SkipSecurityAudit) {
        Write-Status "Running security audit..."
        npm audit --audit-level=moderate
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Security audit passed"
        } else {
            Write-Warning "Security audit found moderate or higher vulnerabilities."
            Write-Warning "Please review and fix security issues before committing."
            Write-Host ""
            Write-Host "To see details: npm audit"
            Write-Host "To fix automatically: npm audit fix"
            Write-Host ""
            $response = Read-Host "Do you want to continue anyway? (y/N)"
            if ($response -notmatch "^[Yy]$") {
                Write-Error "Commit cancelled due to security issues."
                exit 1
            }
        }
    }

    Write-Host ""
    Write-Success "All pre-commit checks passed! 🎉"
    Write-Host "==================================================" -ForegroundColor Blue
}
catch {
    Write-Error "Pre-commit check failed: $($_.Exception.Message)"
    exit 1
}
