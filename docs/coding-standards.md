# Coding Standards

This document outlines the coding standards and best practices for the platform.

## General Principles

### 1. Code Quality
- Write clean, readable, and maintainable code
- Follow SOLID principles
- Use meaningful variable and function names
- Keep functions small and focused
- Avoid code duplication (DRY principle)

### 2. TypeScript Best Practices
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper typing for all variables and functions
- Avoid `any` type unless absolutely necessary
- Use generic types where appropriate

### 3. NestJS Conventions
- Follow NestJS architectural patterns
- Use decorators appropriately
- Implement proper dependency injection
- Use guards, interceptors, and pipes effectively
- Follow module organization patterns

## File and Directory Structure

### 1. File Naming
- Use kebab-case for file names: `user-service.module.ts`
- Use PascalCase for class names: `UserService`
- Use camelCase for variables and functions: `getUserProfile`
- Use UPPER_CASE for constants: `MAX_RETRY_ATTEMPTS`

### 2. Directory Structure
```
src/
├── controllers/     # API controllers
├── services/        # Business logic services
├── entities/        # Database entities
├── dtos/           # Data transfer objects
├── interfaces/     # TypeScript interfaces
├── guards/         # Authentication guards
├── interceptors/   # Request/response interceptors
├── middleware/     # Custom middleware
├── filters/        # Exception filters
├── decorators/     # Custom decorators
├── utils/          # Utility functions
└── constants/      # Application constants
```

### 3. Import Organization
```typescript
// 1. Node modules
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// 2. Internal modules
import { UserService } from './user.service';
import { CreateUserDto } from '../dtos/create-user.dto';

// 3. External libraries
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
```

## TypeScript Standards

### 1. Type Definitions

```typescript
// Use interfaces for object shapes
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Use types for unions and primitives
type UserStatus = 'active' | 'inactive' | 'pending';
type UserRole = 'admin' | 'user' | 'moderator';

// Use enums for constants
enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}
```

### 2. Generic Types

```typescript
// Use generics for reusable types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Use generic constraints
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
}
```

### 3. Optional Properties

```typescript
// Use optional properties appropriately
interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string; // Optional
  address?: {
    street: string;
    city: string;
  };
}
```

## NestJS Standards

### 1. Controllers

```typescript
@Controller('users')
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll(): Promise<ApiResponse<User[]>> {
    const users = await this.userService.findAll();
    return createSuccessResponse(users);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    const user = await this.userService.create(createUserDto);
    return createSuccessResponse(user, 'User created successfully');
  }
}
```

### 2. Services

```typescript
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      this.logger.log(`Creating user with email: ${createUserDto.email}`);
      
      // Business logic here
      const user = this.userRepository.create(createUserDto);
      const savedUser = await this.userRepository.save(user);
      
      this.logger.log(`User created successfully: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

### 3. DTOs

```typescript
export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ description: 'User email address' })
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  @ApiProperty({ description: 'User phone number', required: false })
  phoneNumber?: string;
}
```

## Error Handling

### 1. Exception Handling

```typescript
// Use specific exceptions
if (!user) {
  throw new NotFoundException('User not found');
}

// Use custom exceptions
export class UserAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}

// Handle exceptions in services
try {
  const user = await this.userRepository.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
} catch (error) {
  this.logger.error(`Failed to find user: ${error.message}`, error.stack);
  throw error;
}
```

### 2. Error Responses

```typescript
// Use standardized error responses
return createErrorResponse('User not found', 'USER_NOT_FOUND');

// Or throw HTTP exceptions
throw new HttpException(
  createErrorResponse('User not found', 'USER_NOT_FOUND'),
  HttpStatus.NOT_FOUND
);
```

## Logging Standards

### 1. Log Levels

```typescript
// Use appropriate log levels
this.logger.log('User created successfully');           // Info
this.logger.warn('Rate limit exceeded');               // Warning
this.logger.error('Database connection failed', error); // Error
this.logger.debug('Processing user data');             // Debug
this.logger.verbose('Detailed operation info');        // Verbose
```

### 2. Structured Logging

```typescript
// Include context in logs
this.logger.log('User created', {
  userId: user.id,
  email: user.email,
  duration: Date.now() - startTime
});

// Log errors with stack traces
this.logger.error('Failed to create user', error.stack, {
  userId: user.id,
  email: user.email
});
```

## Testing Standards

### 1. Unit Tests

```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const expectedUser = { id: '1', ...createUserDto };
      jest.spyOn(repository, 'create').mockReturnValue(expectedUser as User);
      jest.spyOn(repository, 'save').mockResolvedValue(expectedUser as User);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(expectedUser);
    });
  });
});
```

### 2. Integration Tests

```typescript
describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe('test@example.com');
      });
  });
});
```

## Documentation Standards

### 1. Code Comments

```typescript
/**
 * Creates a new user in the system
 * @param createUserDto - User data for creation
 * @returns Promise<User> - Created user entity
 * @throws {ConflictException} When user with email already exists
 * @throws {ValidationException} When input validation fails
 */
async create(createUserDto: CreateUserDto): Promise<User> {
  // Implementation
}
```

### 2. API Documentation

```typescript
@ApiOperation({ 
  summary: 'Create a new user',
  description: 'Creates a new user account with the provided information'
})
@ApiResponse({ 
  status: 201, 
  description: 'User created successfully',
  type: User
})
@ApiResponse({ 
  status: 409, 
  description: 'User with email already exists' 
})
@Post()
async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  // Implementation
}
```

## Git Standards

### 1. Commit Messages

```
feat: add user authentication endpoint
fix: resolve database connection timeout
docs: update API documentation
style: format code according to standards
refactor: extract user validation logic
test: add unit tests for user service
chore: update dependencies
```

### 2. Branch Naming

```
feature/user-authentication
bugfix/database-connection-timeout
hotfix/security-vulnerability
docs/api-documentation-update
```

### 3. Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## Performance Standards

### 1. Database Queries

```typescript
// Use proper indexing
@Entity()
@Index(['email']) // Add index for frequently queried fields
export class User {
  @Column({ unique: true })
  email: string;
}

// Use select specific fields
const users = await this.userRepository.find({
  select: ['id', 'email', 'firstName', 'lastName']
});

// Use pagination for large datasets
const users = await this.userRepository.find({
  skip: (page - 1) * limit,
  take: limit
});
```

### 2. Caching

```typescript
// Use caching for expensive operations
@Cache('user-profile', 300) // 5 minutes
async getUserProfile(userId: string): Promise<UserProfile> {
  // Implementation
}
```

## Security Standards

### 1. Input Validation

```typescript
// Always validate input
@IsEmail()
@IsNotEmpty()
email: string;

@IsString()
@MinLength(8)
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
password: string;
```

### 2. Authentication

```typescript
// Use guards for protected endpoints
@UseGuards(AccessTokenGuard)
@Get('profile')
async getProfile(@Request() req) {
  // Implementation
}
```

### 3. Data Sanitization

```typescript
// Sanitize user input
import { sanitize } from 'class-sanitizer';

@Transform(({ value }) => sanitize(value))
description: string;
```

## Environment Configuration

### 1. Environment Variables

```typescript
// Use configuration service
@Injectable()
export class ConfigService {
  constructor(private configService: ConfigService) {}

  get database() {
    return {
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
    };
  }
}
```

### 2. Validation

```typescript
// Validate environment variables
export const configValidationSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
});
```

## Code Review Checklist

### Before Submitting
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Input validation
- [ ] Documentation updated
- [ ] No hardcoded values
- [ ] Proper logging
- [ ] Security considerations

### During Review
- [ ] Code is readable and maintainable
- [ ] Business logic is correct
- [ ] Error handling is appropriate
- [ ] Performance considerations
- [ ] Security implications
- [ ] Test coverage is adequate
- [ ] Documentation is clear
