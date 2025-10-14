# CI/CD Pipeline Documentation

This repository includes comprehensive CI/CD pipelines using GitHub Actions, pre-commit hooks with Husky, and automated code quality checks.

## 🚀 Workflows

### 1. Main CI Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main`, `develop`, or `feature/*` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
- **lint-and-test**: Runs on Ubuntu with Node.js 18.x and 20.x
  - ESLint code linting
  - Prettier formatting checks
  - TypeScript type checking
  - API build verification
  - Security audit
  - Test execution (if available)

- **build-and-deploy**: Runs after lint-and-test passes
  - Builds all applications
  - Uploads build artifacts
  - Deploys to staging (develop branch)
  - Deploys to production (main branch)

### 2. Dependency Update Check (`.github/workflows/dependency-update.yml`)

**Triggers:**
- Weekly schedule (Mondays at midnight)
- Manual workflow dispatch

**Features:**
- Checks for outdated packages
- Security vulnerability scanning
- Creates GitHub issues for security issues

## 🛠️ Pre-commit Hooks (Husky)

### Setup
```bash
# Install dependencies
npm install

# Initialize Husky
npx husky install

# Make hooks executable (Linux/Mac)
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Hooks

#### Pre-commit Hook (`.husky/pre-commit`)
- Runs `lint-staged` for staged files
- Executes TypeScript type checking
- Builds API application
- Prevents commits if any step fails

#### Commit Message Hook (`.husky/commit-msg`)
- Validates commit message format using commitlint
- Enforces conventional commit standards

## 📋 Code Quality Tools

### ESLint Configuration (`.eslintrc.js`)
- TypeScript support with `@typescript-eslint`
- Prettier integration
- Custom rules for NestJS projects
- Override rules for test files

### Prettier Configuration (`.prettierrc`)
- Consistent code formatting
- Single quotes, semicolons
- 80 character line width
- LF line endings

### Commitlint Configuration (`commitlint.config.js`)
- Conventional commit format enforcement
- Type validation (feat, fix, docs, etc.)
- Scope and subject validation
- Header length limits

## 🎯 Available Scripts

### Linting & Formatting
```bash
npm run lint              # Run ESLint with auto-fix
npm run lint:check        # Run ESLint without auto-fix
npm run format            # Format code with Prettier
npm run format:check      # Check code formatting
```

### Type Checking & Building
```bash
npm run type-check        # Run TypeScript type checking
npm run build:api         # Build API application
npm run build:lambdas     # Build Lambda functions
```

### Development
```bash
npm run start:api:dev     # Start API in development mode
npm run start:api         # Start API in production mode
```

### Setup
```bash
# Linux/Mac
./scripts/setup.sh

# Windows PowerShell
.\scripts\setup.ps1
```

## 🔧 Configuration Files

### Package.json Scripts
- `prepare`: Installs Husky hooks
- `pre-commit`: Runs lint-staged
- `lint-staged`: Configures file-specific linting

### Lint-staged Configuration
```json
{
  "lint-staged": {
    "*.{ts,js}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

## 🚦 Quality Gates

### Pre-commit Requirements
1. **ESLint**: No linting errors
2. **Prettier**: Code properly formatted
3. **TypeScript**: No type errors
4. **Build**: API builds successfully

### CI Pipeline Requirements
1. **Linting**: All code passes ESLint
2. **Formatting**: All code passes Prettier
3. **Type Checking**: No TypeScript errors
4. **Build**: All applications build successfully
5. **Security**: No high/critical vulnerabilities
6. **Tests**: All tests pass (if available)

## 📊 Commit Message Format

Follow conventional commit format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes
- `revert`: Reverting changes

### Examples
```
feat(api): add user authentication endpoints
fix(database): resolve connection timeout issue
docs: update API documentation
chore: update dependencies
```

## 🔍 Troubleshooting

### Common Issues

1. **Pre-commit hook fails**
   - Run `npm run lint` to fix linting issues
   - Run `npm run format` to fix formatting issues
   - Run `npm run type-check` to fix type errors

2. **CI pipeline fails**
   - Check the Actions tab for detailed error logs
   - Ensure all dependencies are properly installed
   - Verify TypeScript configuration

3. **Commit message rejected**
   - Use conventional commit format
   - Ensure type is lowercase
   - Keep subject under 100 characters

### Manual Override
If you need to bypass pre-commit hooks (not recommended):
```bash
git commit --no-verify -m "your message"
```

## 🎉 Benefits

- **Code Quality**: Consistent code style and quality
- **Early Detection**: Catch issues before they reach the repository
- **Automated Checks**: No manual intervention required
- **Team Consistency**: Everyone follows the same standards
- **Security**: Regular vulnerability scanning
- **Deployment Safety**: Only tested code reaches production
