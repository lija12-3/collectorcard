# Auth Library Documentation

The Cardinal Auth Library provides comprehensive authentication and authorization functionality for the Cardinal platform.

## Overview

The Auth Library is a shared library that provides:
- JWT token generation and validation
- Password encryption and verification
- Role-based access control (RBAC)
- Authentication guards and decorators
- Encryption services for sensitive data

## Installation

```bash
# Install the library
npm install @cardinal/auth

# Or if working within the Cardinal monorepo
npm install file:../../libs/auth
```

## Quick Start

### 1. Basic Setup

```typescript
import { AuthModule } from '@cardinal/auth';

@Module({
  imports: [
    AuthModule.forRoot({
      config: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiresIn: '1h',
        encryptionKey: process.env.ENCRYPTION_KEY,
      },
    }),
  ],
})
export class AppModule {}
```

### 2. Using in a Service

```typescript
import { Injectable } from '@nestjs/common';
import { JwtService, EncryptionService } from '@cardinal/auth';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async createUser(userData: CreateUserDto) {
    // Hash password
    const hashedPassword = this.encryptionService.hashPassword(userData.password);
    
    // Create user
    const user = await this.userRepository.save({
      ...userData,
      passwordHash: hashedPassword,
    });

    // Generate JWT token
    const token = await this.jwtService.generateToken(user);
    
    return { user, token };
  }
}
```

## API Reference

### JwtService

The JwtService handles JWT token operations.

#### Methods

##### `generateToken(user, tokenType?, expiresIn?)`

Generates a JWT token for a user.

**Parameters:**
- `user` (ICardinalUser): User object
- `tokenType` (TokenType, optional): Type of token (default: ACCESS)
- `expiresIn` (string, optional): Token expiration time (default: '1h')

**Returns:** `Promise<string>`

**Example:**
```typescript
const token = await this.jwtService.generateToken(user);
const refreshToken = await this.jwtService.generateRefreshToken(user);
```

##### `generateRefreshToken(user)`

Generates a refresh token for a user.

**Parameters:**
- `user` (ICardinalUser): User object

**Returns:** `Promise<string>`

##### `verifyToken(token)`

Verifies and decodes a JWT token.

**Parameters:**
- `token` (string): JWT token to verify

**Returns:** `Promise<IJwtPayload>`

**Throws:** `Error` if token is invalid

**Example:**
```typescript
try {
  const payload = await this.jwtService.verifyToken(token);
  console.log('User ID:', payload.sub);
} catch (error) {
  console.error('Invalid token:', error.message);
}
```

##### `generateTokenPair(user)`

Generates both access and refresh tokens.

**Parameters:**
- `user` (ICardinalUser): User object

**Returns:** `Promise<{ accessToken: string; refreshToken: string }>`

### EncryptionService

The EncryptionService handles password hashing and data encryption.

#### Methods

##### `hashPassword(password)`

Hashes a password using PBKDF2.

**Parameters:**
- `password` (string): Plain text password

**Returns:** `string` - Hashed password with salt

**Example:**
```typescript
const hashedPassword = this.encryptionService.hashPassword('password123');
```

##### `verifyPassword(password, hashedPassword)`

Verifies a password against its hash.

**Parameters:**
- `password` (string): Plain text password
- `hashedPassword` (string): Hashed password to verify against

**Returns:** `boolean` - True if password matches

**Example:**
```typescript
const isValid = this.encryptionService.verifyPassword('password123', hashedPassword);
```

##### `encrypt(text)`

Encrypts text using AES-256-GCM.

**Parameters:**
- `text` (string): Text to encrypt

**Returns:** `string` - Encrypted text

**Example:**
```typescript
const encrypted = this.encryptionService.encrypt('sensitive data');
```

##### `decrypt(encryptedText)`

Decrypts text encrypted with the encrypt method.

**Parameters:**
- `encryptedText` (string): Encrypted text to decrypt

**Returns:** `string` - Decrypted text

**Throws:** `Error` if decryption fails

**Example:**
```typescript
try {
  const decrypted = this.encryptionService.decrypt(encrypted);
} catch (error) {
  console.error('Decryption failed:', error.message);
}
```

##### `generateRandomString(length?)`

Generates a cryptographically secure random string.

**Parameters:**
- `length` (number, optional): Length of string (default: 32)

**Returns:** `string` - Random string

## Guards

### AccessTokenGuard

Validates JWT tokens and adds user information to the request.

#### Usage

```typescript
import { AccessTokenGuard } from '@cardinal/auth';

@Controller('protected')
@UseGuards(AccessTokenGuard)
export class ProtectedController {
  @Get()
  getProtectedData(@Request() req) {
    // req.user contains user information
    return { user: req.user };
  }
}
```

#### Request Object

After successful authentication, the request object contains:

```typescript
interface IRequest extends Request {
  token?: ICardinalTokenBodyBase;
  rawtoken?: string;
  user?: ICardinalUser;
  useraudit?: {
    auditdate: number;
    useremail: string;
    username: string;
    ipaddress?: string;
  };
}
```

### RolesGuard

Enforces role-based access control.

#### Usage

```typescript
import { RolesGuard, Roles } from '@cardinal/auth';

@Controller('admin')
@UseGuards(AccessTokenGuard, RolesGuard)
export class AdminController {
  @Get()
  @Roles(Role.ADMIN)
  getAdminData() {
    return { data: 'admin only' };
  }

  @Get('moderator')
  @Roles(Role.ADMIN, Role.MODERATOR)
  getModeratorData() {
    return { data: 'moderator or admin' };
  }
}
```

## Decorators

### Authentication Decorators

#### `@Public()`

Marks an endpoint as public (no authentication required).

```typescript
@Controller('auth')
export class AuthController {
  @Post('login')
  @Public()
  login(@Body() loginDto: LoginDto) {
    // No authentication required
  }
}
```

#### `@RequireAuth()`

Explicitly requires authentication (default behavior).

```typescript
@Controller('users')
export class UserController {
  @Get('profile')
  @RequireAuth()
  getProfile(@Request() req) {
    // Authentication required
  }
}
```

#### `@Roles(...roles)`

Specifies required roles for an endpoint.

```typescript
@Controller('admin')
export class AdminController {
  @Get('users')
  @Roles(Role.ADMIN)
  getAllUsers() {
    // Only admins can access
  }
}
```

#### `@Groups(...groups)`

Specifies required groups for an endpoint.

```typescript
@Controller('management')
export class ManagementController {
  @Get('reports')
  @Groups(CardinalUserGroups.ADMINISTRATORS, CardinalUserGroups.MANAGERS)
  getReports() {
    // Only administrators and managers can access
  }
}
```

## Types and Interfaces

### Core Types

```typescript
enum TokenType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  CHANGEPASSWORD = 'CHANGEPASSWORD',
  VERIFYEMAIL = 'VERIFYEMAIL',
  APIACCESS = 'APIACCESS',
}

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  VIEWER = 'VIEWER',
}

enum CardinalUserGroups {
  ADMINISTRATORS = 'ADMINISTRATORS',
  MANAGERS = 'MANAGERS',
  USERS = 'USERS',
  VIEWERS = 'VIEWERS',
}
```

### User Interface

```typescript
interface ICardinalUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  userroles: Role[];
  groupclaim: CardinalUserGroups;
  passwordhash?: string;
  [key: string]: any;
}
```

### JWT Payload

```typescript
interface IJwtPayload {
  sub: string;
  email: string;
  roles: Role[];
  groups: CardinalUserGroups[];
  tokenType: TokenType;
  iat?: number;
  exp?: number;
}
```

### Configuration

```typescript
interface IAuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  encryptionKey: string;
  awsKmsKeyId?: string;
  ghostKey?: string;
  customAPIKey?: string;
  rateLimit?: {
    windowMs: number;
    max: number;
  };
}
```

## Configuration

### Module Configuration

```typescript
AuthModule.forRoot({
  config: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    encryptionKey: process.env.ENCRYPTION_KEY,
    awsKmsKeyId: process.env.AWS_KMS_KEY_ID,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
  },
  enableGlobalGuards: true,
  enableGlobalInterceptors: true,
  enableMiddleware: true,
})
```

### Environment Variables

```env
# Required
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-32-character-encryption-key

# Optional
JWT_EXPIRES_IN=1h
AWS_KMS_KEY_ID=arn:aws:kms:region:account:key/key-id
GHOST_KEY=your-ghost-key
CUSTOM_API_KEY=your-custom-api-key
```

## Security Best Practices

### 1. Token Security

```typescript
// Use secure token expiration
const token = await this.jwtService.generateToken(user, TokenType.ACCESS, '15m');

// Implement token refresh
const refreshToken = await this.jwtService.generateRefreshToken(user);
```

### 2. Password Security

```typescript
// Always hash passwords
const hashedPassword = this.encryptionService.hashPassword(password);

// Verify passwords securely
const isValid = this.encryptionService.verifyPassword(password, hashedPassword);
```

### 3. Data Encryption

```typescript
// Encrypt sensitive data
const encryptedData = this.encryptionService.encrypt(sensitiveData);

// Decrypt when needed
const decryptedData = this.encryptionService.decrypt(encryptedData);
```

### 4. Role-Based Access

```typescript
// Use specific roles
@Roles(Role.ADMIN)
async deleteUser(userId: string) {
  // Only admins can delete users
}

// Use groups for broader access
@Groups(CardinalUserGroups.ADMINISTRATORS, CardinalUserGroups.MANAGERS)
async viewReports() {
  // Administrators and managers can view reports
}
```

## Error Handling

### Common Errors

#### Invalid Token

```typescript
try {
  const payload = await this.jwtService.verifyToken(token);
} catch (error) {
  throw new UnauthorizedException('Invalid token');
}
```

#### Insufficient Permissions

```typescript
// RolesGuard automatically throws ForbiddenException
@Roles(Role.ADMIN)
async adminOnlyMethod() {
  // If user doesn't have ADMIN role, ForbiddenException is thrown
}
```

#### Encryption Errors

```typescript
try {
  const decrypted = this.encryptionService.decrypt(encryptedData);
} catch (error) {
  throw new BadRequestException('Failed to decrypt data');
}
```

## Testing

### Unit Tests

```typescript
describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtService],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should generate a valid token', async () => {
    const user = { id: '1', email: 'test@example.com' };
    const token = await service.generateToken(user);
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });
});
```

### Integration Tests

```typescript
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/protected (GET)', () => {
    return request(app.getHttpServer())
      .get('/protected')
      .set('Authorization', 'Bearer valid-token')
      .expect(200);
  });
});
```

## Migration Guide

### From v1.x to v2.x

1. Update imports:
```typescript
// Old
import { AuthService } from '@cardinal/auth';

// New
import { JwtService, EncryptionService } from '@cardinal/auth';
```

2. Update service usage:
```typescript
// Old
const token = await this.authService.generateToken(user);

// New
const token = await this.jwtService.generateToken(user);
```

3. Update configuration:
```typescript
// Old
AuthModule.forRoot({
  jwtSecret: 'secret',
  // ...
})

// New
AuthModule.forRoot({
  config: {
    jwtSecret: 'secret',
    // ...
  }
})
```

## Troubleshooting

### Common Issues

1. **Token verification fails**: Check JWT secret configuration
2. **Password verification fails**: Ensure password was hashed with the same service
3. **Encryption/decryption fails**: Check encryption key configuration
4. **Guards not working**: Ensure guards are properly imported and configured

### Debug Mode

Enable debug logging:

```typescript
// Set debug environment
DEBUG=cardinal:auth npm run dev
```

### Support

For issues and questions:
- Check the [troubleshooting guide](../operations/troubleshooting.md)
- Create an issue in the repository
- Contact the development team
