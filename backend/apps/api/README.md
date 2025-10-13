# Collectors Card API

A comprehensive NestJS-based API application with advanced features including global exception handling, custom providers, middleware, decorators, and guards.

## 🚀 Features

### Core Features
- **NestJS Framework**: Modern, scalable Node.js framework
- **MikroORM**: Type-safe ORM with MySQL support
- **AWS Aurora DB**: Support for read/write replicas
- **User Management**: Complete user entity and service
- **Authentication**: JWT-based authentication with guards
- **Validation**: Request validation with class-validator
- **Error Handling**: Global exception handling
- **CORS**: Cross-origin resource sharing support

### Advanced Features
- **Global Exception Filter**: Centralized error handling
- **Custom Providers**: Encryption, logging, and caching services
- **Middleware**: Request logging, CORS, and rate limiting
- **Custom Decorators**: @Encrypt, @Decrypt, @Public, @Roles, @Cache
- **Guards**: Role-based access control and public endpoints
- **Interceptors**: Caching and logging interceptors
- **Rate Limiting**: Built-in rate limiting protection

## 📁 Project Structure

```
apps/api/src/
├── core/
│   └── core.module.ts           # Global core module
├── decorators/
│   ├── cache.decorator.ts       # @Cache decorator
│   ├── current-user.decorator.ts # @CurrentUser decorator
│   ├── decrypt.decorator.ts     # @Decrypt decorator
│   ├── encrypt.decorator.ts     # @Encrypt decorator
│   ├── public.decorator.ts      # @Public decorator
│   ├── roles.decorator.ts       # @Roles decorator
│   └── index.ts                 # Decorator exports
├── filters/
│   └── global-exception.filter.ts # Global exception handling
├── guards/
│   ├── public.guard.ts          # Public endpoint guard
│   ├── roles.guard.ts           # Role-based access guard
│   └── index.ts                 # Guard exports
├── interceptors/
│   ├── cache.interceptor.ts     # Response caching
│   ├── logging.interceptor.ts   # Request/response logging
│   └── index.ts                 # Interceptor exports
├── middleware/
│   ├── cors.middleware.ts       # CORS handling
│   ├── rate-limiting.middleware.ts # Rate limiting
│   ├── request-logging.middleware.ts # Request logging
│   └── index.ts                 # Middleware exports
├── modules/
│   └── user/                    # User module
│       ├── dto/                 # Data Transfer Objects
│       ├── user.controller.ts   # User endpoints
│       ├── user.service.ts      # User business logic
│       ├── user.module.ts       # User module definition
│       └── index.ts             # Module exports
├── providers/
│   ├── cache.provider.ts        # In-memory caching
│   ├── encryption.provider.ts   # Encryption/decryption
│   ├── logging.provider.ts      # Winston logging
│   └── index.ts                 # Provider exports
├── app.module.ts                # Main application module
├── main.ts                      # Application bootstrap
└── README.md                    # This file
```

## 🔧 Providers

### EncryptionProvider
- **Encrypt/Decrypt**: AES-256-GCM encryption
- **Hashing**: PBKDF2 password hashing
- **Random Generation**: Secure random string generation

```typescript
@Injectable()
export class MyService {
  constructor(private encryptionProvider: EncryptionProvider) {}
  
  encryptData(data: string) {
    return this.encryptionProvider.encrypt(data);
  }
}
```

### LoggingProvider
- **Winston Integration**: Structured logging
- **File Rotation**: Automatic log file rotation
- **Multiple Levels**: Error, warn, info, debug, verbose

### CacheProvider
- **In-Memory Cache**: Fast key-value storage
- **TTL Support**: Time-to-live for cache entries
- **Statistics**: Cache hit/miss statistics

## 🛡️ Guards

### RolesGuard
Role-based access control for endpoints.

```typescript
@Get()
@Roles('admin', 'user')
async findAll() {
  // Only users with 'admin' or 'user' roles can access
}
```

### PublicGuard
Mark endpoints as public (skip authentication).

```typescript
@Get('public')
@Public()
async publicEndpoint() {
  // This endpoint is accessible without authentication
}
```

## 🎨 Decorators

### @Encrypt
Encrypt specific request body fields.

```typescript
@Post()
async create(@Body() data: CreateUserDto, @Encrypt('sensitiveData') encryptedData: string) {
  // 'sensitiveData' field will be automatically encrypted
}
```

### @Decrypt
Decrypt specific request body fields.

```typescript
@Post()
async create(@Body() data: CreateUserDto, @Decrypt('encryptedData') decryptedData: string) {
  // 'encryptedData' field will be automatically decrypted
}
```

### @Cache
Cache endpoint responses.

```typescript
@Get()
@Cache(300000) // Cache for 5 minutes
async findAll() {
  // Response will be cached for 5 minutes
}
```

### @CurrentUser
Get current authenticated user.

```typescript
@Get('profile')
async getProfile(@CurrentUser() user: User) {
  // Access current user data
}
```

## 🔄 Middleware

### RequestLoggingMiddleware
Logs all incoming requests and outgoing responses with timing.

### CorsMiddleware
Handles CORS configuration with environment-based origins.

### RateLimitingMiddleware
Implements rate limiting to prevent abuse.

## 🚦 Interceptors

### LoggingInterceptor
Global request/response logging with error handling.

### CacheInterceptor
Automatic response caching based on @Cache decorator.

## 📊 API Endpoints

### Users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users` - List users (cached, role-protected)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `PUT /api/v1/users/:id/soft-delete` - Soft delete
- `PUT /api/v1/users/:id/verify-email` - Email verification
- `PUT /api/v1/users/:id/verify-phone` - Phone verification
- `GET /api/v1/users/email/:email` - Find by email (public)
- `GET /api/v1/users/nickname/:nickName` - Find by nickname

## 🔧 Environment Variables

```env
# Database Configuration
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=collectors_card
DB_SSL=false
DB_LOGGING=false

# Read Replica Configuration (Optional)
DB_READ_HOST=
DB_READ_PORT=3306
DB_READ_USERNAME=
DB_READ_PASSWORD=

# Application Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Security
ENCRYPTION_KEY=your-encryption-key
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=1d

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Logging
LOG_LEVEL=info
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run migrations**:
   ```bash
   npm run migration:up
   ```

4. **Start development server**:
   ```bash
   npm run start:api:dev
   ```

5. **Build for production**:
   ```bash
   npm run build:api
   npm run start:api
   ```

## 📝 Usage Examples

### Creating a User with Encryption
```typescript
@Post()
async create(@Body() createUserDto: CreateUserDto) {
  // Sensitive data is automatically encrypted
  return this.userService.create(createUserDto);
}
```

### Role-Based Access Control
```typescript
@Get('admin-only')
@Roles('admin')
async adminOnlyEndpoint() {
  // Only admin users can access
}
```

### Caching Responses
```typescript
@Get('expensive-operation')
@Cache(600000) // Cache for 10 minutes
async expensiveOperation() {
  // Result will be cached
}
```

### Public Endpoints
```typescript
@Get('health')
@Public()
async healthCheck() {
  // No authentication required
}
```

## 🔒 Security Features

- **Global Exception Filter**: Prevents information leakage
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **CORS Protection**: Configurable cross-origin policies
- **Input Validation**: Comprehensive request validation
- **Encryption**: Built-in data encryption capabilities
- **Role-Based Access**: Fine-grained permission control

## 📈 Monitoring & Logging

- **Structured Logging**: JSON-formatted logs with Winston
- **Request Tracking**: Complete request/response logging
- **Error Tracking**: Detailed error logging with stack traces
- **Performance Monitoring**: Request timing and performance metrics
- **Cache Statistics**: Cache hit/miss ratios and performance

This API provides a robust, scalable foundation for the Collectors Card application with enterprise-grade features and security.