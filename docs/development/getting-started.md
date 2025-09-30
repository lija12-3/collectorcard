# Getting Started with Cardinal

This guide will help you get up and running with the Cardinal platform quickly.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **npm** 8.0 or higher (or yarn)
- **Git** for version control
- **Docker** (optional, for containerized development)
- **AWS CLI** (for deployment)

### Verify Prerequisites

```bash
# Check Node.js version
node --version  # Should be 18.0+

# Check npm version
npm --version   # Should be 8.0+

# Check Git
git --version

# Check Docker (optional)
docker --version

# Check AWS CLI (for deployment)
aws --version
```

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cardinal
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# Or using yarn
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=cardinal

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
ENCRYPTION_KEY=your-32-character-encryption-key

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Microservice URLs (for BFF)
USER_SERVICE_URL=http://localhost:3001
PAYMENT_SERVICE_URL=http://localhost:3002
NOTIFICATION_SERVICE_URL=http://localhost:3003
CONTENT_SERVICE_URL=http://localhost:3004
ANALYTICS_SERVICE_URL=http://localhost:3005

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Third-party Services
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# Email Configuration
FROM_EMAIL=noreply@yourdomain.com
```

## Quick Start

### 1. Build the Project

```bash
# Build all libraries and services
npm run build

# Or build specific components
npm run build:libs
npm run build:services
```

### 2. Start Development Servers

```bash
# Start all services in development mode
npm run dev

# Or start individual services
npm run dev:user-service
npm run dev:payment-service
npm run dev:notification-service
npm run dev:bff-service
```

### 3. Verify Installation

Open your browser and navigate to:

- **BFF Service**: http://localhost:3000
- **User Service**: http://localhost:3001
- **Payment Service**: http://localhost:3002
- **Notification Service**: http://localhost:3003

You should see health check responses from each service.

## Development Workflow

### 1. Project Structure

```
cardinal/
├── services/           # Microservices
│   ├── user-service/
│   ├── payment-service/
│   ├── notification-service/
│   └── bff-service/
├── libs/              # Shared libraries
│   ├── auth/
│   ├── database/
│   ├── logger/
│   └── aws-*
├── shared/            # Shared types and utilities
├── scripts/           # Build and deployment scripts
└── docs/              # Documentation
```

### 2. Working with Services

Each service is a standalone NestJS application:

```bash
# Navigate to a service
cd services/user-service

# Install dependencies
npm install

# Start in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### 3. Working with Libraries

Libraries are shared across services:

```bash
# Navigate to a library
cd libs/auth

# Install dependencies
npm install

# Build the library
npm run build

# Watch for changes
npm run dev
```

## Database Setup

### 1. PostgreSQL Installation

#### Using Docker (Recommended)

```bash
# Start PostgreSQL with Docker
docker run --name cardinal-postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=cardinal \
  -p 5432:5432 \
  -d postgres:13
```

#### Local Installation

Follow the [PostgreSQL installation guide](https://www.postgresql.org/download/) for your operating system.

### 2. Database Configuration

```bash
# Connect to PostgreSQL
psql -h localhost -U postgres -d cardinal

# Create database (if not exists)
CREATE DATABASE cardinal;

# Create user (optional)
CREATE USER cardinal_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cardinal TO cardinal_user;
```

### 3. Run Migrations

```bash
# Run database migrations
npm run migrate

# Or run migrations for specific service
npm run migrate:user-service
```

## Testing

### 1. Run All Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

### 2. Run Service-Specific Tests

```bash
# Test specific service
npm test -- --service=user-service

# Test specific library
npm test -- --library=auth
```

### 3. Integration Tests

```bash
# Run integration tests
npm run test:integration

# Run integration tests for specific service
npm run test:integration -- --service=payment-service
```

## API Testing

### 1. Health Checks

Test that services are running:

```bash
# BFF Service
curl http://localhost:3000/api/v1/health

# User Service
curl http://localhost:3001/health

# Payment Service
curl http://localhost:3002/health

# Notification Service
curl http://localhost:3003/health
```

### 2. Authentication Test

```bash
# Register a user
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. BFF Aggregation Test

```bash
# Get dashboard data (requires authentication)
curl -X GET http://localhost:3000/api/v1/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### 2. Database Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Check database exists
psql -h localhost -U postgres -l

# Test connection
psql -h localhost -U postgres -d cardinal -c "SELECT 1;"
```

#### 3. Environment Variables

```bash
# Check if .env file exists
ls -la .env

# Verify environment variables
node -e "console.log(process.env.JWT_SECRET)"
```

#### 4. Dependencies Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode

Enable debug logging:

```bash
# Set debug environment
DEBUG=cardinal:* npm run dev

# Or set specific debug namespace
DEBUG=cardinal:auth npm run dev
```

## Next Steps

### 1. Explore the Codebase

- [Architecture Overview](architecture/system-architecture.md)
- [BFF Pattern](architecture/bff-pattern.md)
- [API Documentation](api/)

### 2. Development Guidelines

- [Coding Standards](development/coding-standards.md)
- [Testing Guide](development/testing-guide.md)
- [API Documentation](development/api-documentation.md)

### 3. Deployment

- [AWS Lambda Deployment](deployment/aws-lambda.md)
- [Docker Deployment](deployment/docker.md)
- [Environment Configuration](deployment/environment-config.md)

### 4. Operations

- [Monitoring & Logging](deployment/monitoring.md)
- [Troubleshooting Guide](operations/troubleshooting.md)
- [Performance Optimization](operations/performance.md)

## Getting Help

### 1. Documentation

- Check the [documentation index](README.md)
- Read service-specific documentation
- Review API documentation

### 2. Community

- Create an issue in the repository
- Check existing issues and discussions
- Join the community chat

### 3. Support

- Review the troubleshooting guide
- Check the FAQ section
- Contact the development team

## Contributing

If you want to contribute to Cardinal:

1. Read the [Contributing Guide](CONTRIBUTING.md)
2. Follow the [Coding Standards](development/coding-standards.md)
3. Write tests for your changes
4. Submit a pull request

---

Welcome to Cardinal! 🚀
