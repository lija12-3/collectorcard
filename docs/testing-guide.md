# Testing Guide

This guide covers testing strategies and best practices for the platform.

## Testing Strategy

### 1. Testing Pyramid

```
    /\
   /  \
  / E2E \  <- Few, slow, expensive
 /______\
/        \
/Integration\ <- Some, medium speed
/____________\
/              \
/   Unit Tests   \ <- Many, fast, cheap
/________________\
```

### 2. Test Types

- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test service interactions
- **End-to-End Tests**: Test complete user workflows
- **Contract Tests**: Test API contracts between services

## Unit Testing

### 1. Service Testing

```typescript
// user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { EncryptionService } from '@collectorscard/auth';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;
  let encryptionService: EncryptionService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockEncryptionService = {
    hashPassword: jest.fn(),
    verifyPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    encryptionService = module.get<EncryptionService>(EncryptionService);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      const hashedPassword = 'hashed-password';
      const expectedUser = { id: '1', ...createUserDto, passwordHash: hashedPassword };

      mockEncryptionService.hashPassword.mockReturnValue(hashedPassword);
      mockRepository.create.mockReturnValue(expectedUser);
      mockRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockEncryptionService.hashPassword).toHaveBeenCalledWith('password123');
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        passwordHash: hashedPassword,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(expectedUser);
    });

    it('should throw ConflictException when user already exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      mockRepository.findOne.mockResolvedValue({ id: '1', email: 'test@example.com' });

      await expect(service.create(createUserDto)).rejects.toThrow('User with this email already exists');
    });
  });
});
```

### 2. Controller Testing

```typescript
// user.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      const expectedUser = { id: '1', ...createUserDto };
      mockUserService.create.mockResolvedValue(expectedUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
```

### 3. Guard Testing

```typescript
// access-token.guard.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { AccessTokenGuard } from './access-token.guard';
import { JwtService } from '@nestjs/jwt';

describe('AccessTokenGuard', () => {
  let guard: AccessTokenGuard;
  let jwtService: JwtService;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessTokenGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    guard = module.get<AccessTokenGuard>(AccessTokenGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should allow access with valid token', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const mockPayload = {
      sub: 'user-1',
      email: 'test@example.com',
      roles: ['USER'],
    };

    mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest['user']).toEqual({
      id: 'user-1',
      email: 'test@example.com',
      userroles: ['USER'],
    });
  });

  it('should deny access with invalid token', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer invalid-token',
      },
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    await expect(guard.canActivate(mockContext)).rejects.toThrow('Invalid access token');
  });
});
```

## Integration Testing

### 1. Service Integration Tests

```typescript
// user.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { EncryptionService } from '@collectorscard/auth';

describe('UserService Integration', () => {
  let service: UserService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserService, EncryptionService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create and retrieve a user', async () => {
    const createUserDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    };

    const user = await service.create(createUserDto);
    expect(user.id).toBeDefined();
    expect(user.email).toBe(createUserDto.email);

    const foundUser = await service.findOne(user.id);
    expect(foundUser).toEqual(user);
  });
});
```

### 2. API Integration Tests

```typescript
// user.e2e.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { User } from './entities/user.entity';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe('test@example.com');
      });
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });
});
```

## End-to-End Testing

### 1. BFF Service E2E Tests

```typescript
// bff.e2e.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { BffServiceModule } from './bff-service.module';

describe('BFF Service (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BffServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/dashboard (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/dashboard')
      .set('Authorization', 'Bearer valid-token')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('user');
        expect(res.body.data).toHaveProperty('recentPayments');
        expect(res.body.data).toHaveProperty('recentNotifications');
      });
  });
});
```

## Test Configuration

### 1. Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^@collectorscard/(.*)$': '<rootDir>/libs/$1/src',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
};
```

### 2. Test Setup

```typescript
// src/test/setup.ts
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

// Global test setup
beforeAll(async () => {
  // Setup test database
  const module = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: [/* your entities */],
        synchronize: true,
      }),
    ],
  }).compile();

  // Initialize test data
  await setupTestData();
});

afterAll(async () => {
  // Cleanup test data
  await cleanupTestData();
});
```

## Mocking Strategies

### 1. Service Mocking

```typescript
// Mock external services
const mockUserService = {
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Mock database
const mockRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
```

### 2. HTTP Mocking

```typescript
// Mock HTTP requests
import nock from 'nock';

beforeEach(() => {
  nock('http://localhost:3001')
    .get('/users/1')
    .reply(200, { id: '1', email: 'test@example.com' });
});

afterEach(() => {
  nock.cleanAll();
});
```

### 3. AWS Service Mocking

```typescript
// Mock AWS services
import AWS from 'aws-sdk';

const mockSQS = {
  sendMessage: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({ MessageId: '123' }),
  }),
};

jest.mock('aws-sdk', () => ({
  SQS: jest.fn(() => mockSQS),
}));
```

## Test Data Management

### 1. Test Fixtures

```typescript
// test/fixtures/user.fixtures.ts
export const userFixtures = {
  validUser: {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password123',
  },
  invalidUser: {
    email: 'invalid-email',
    firstName: '',
    lastName: 'Doe',
  },
  existingUser: {
    id: '1',
    email: 'existing@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
  },
};
```

### 2. Test Database Seeding

```typescript
// test/helpers/database.helper.ts
export async function seedTestData() {
  const userRepository = getRepository(User);
  
  await userRepository.save([
    { email: 'user1@example.com', firstName: 'User', lastName: 'One' },
    { email: 'user2@example.com', firstName: 'User', lastName: 'Two' },
  ]);
}

export async function cleanupTestData() {
  const userRepository = getRepository(User);
  await userRepository.clear();
}
```

## Performance Testing

### 1. Load Testing

```typescript
// test/performance/load.test.ts
import { performance } from 'perf_hooks';

describe('Performance Tests', () => {
  it('should handle 100 concurrent requests', async () => {
    const startTime = performance.now();
    
    const promises = Array.from({ length: 100 }, () =>
      request(app.getHttpServer())
        .get('/users')
        .expect(200)
    );
    
    await Promise.all(promises);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
  });
});
```

### 2. Memory Testing

```typescript
// test/performance/memory.test.ts
describe('Memory Tests', () => {
  it('should not have memory leaks', async () => {
    const initialMemory = process.memoryUsage();
    
    // Perform operations that might cause memory leaks
    for (let i = 0; i < 1000; i++) {
      await service.createUser({ /* user data */ });
    }
    
    // Force garbage collection
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage();
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
    
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Less than 50MB increase
  });
});
```

## Test Coverage

### 1. Coverage Goals

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 80%+ coverage
- **E2E Tests**: Critical user paths

### 2. Coverage Reports

```bash
# Generate coverage report
npm run test:cov

# View coverage in browser
npm run test:cov -- --coverageReporters=html
open coverage/index.html
```

## Continuous Integration

### 1. GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run unit tests
      run: npm run test:unit
      
    - name: Run integration tests
      run: npm run test:integration
      
    - name: Run e2e tests
      run: npm run test:e2e
      
    - name: Upload coverage
      uses: codecov/codecov-action@v1
```

## Best Practices

### 1. Test Organization

- Group related tests using `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests independent and isolated

### 2. Test Data

- Use factories for test data generation
- Clean up test data after each test
- Use realistic test data
- Avoid hardcoded values

### 3. Assertions

- Use specific assertions
- Test both positive and negative cases
- Verify side effects
- Check error conditions

### 4. Mocking

- Mock external dependencies
- Don't mock the code under test
- Use mocks sparingly
- Verify mock interactions

## Troubleshooting

### 1. Common Issues

- **Tests timing out**: Increase timeout or fix async issues
- **Database conflicts**: Use unique test data or cleanup
- **Mock not working**: Check mock setup and scope
- **Coverage not accurate**: Check test file patterns

### 2. Debugging Tests

```bash
# Run specific test with debug output
npm test -- --testNamePattern="should create user" --verbose

# Run tests in watch mode
npm test -- --watch

# Debug with Node.js inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```
