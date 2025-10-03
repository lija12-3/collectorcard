# Performance Optimization Guide

This guide covers performance optimization strategies for the Cardinal platform.

## Performance Monitoring

### 1. Key Metrics

#### Response Time Metrics
- **API Response Time**: Time to complete API requests
- **Database Query Time**: Time to execute database queries
- **Cache Hit Rate**: Percentage of cache hits vs misses
- **Service Latency**: Time between service calls

#### Resource Metrics
- **CPU Usage**: CPU utilization percentage
- **Memory Usage**: RAM consumption
- **Disk I/O**: Disk read/write operations
- **Network I/O**: Network traffic and bandwidth

#### Business Metrics
- **Request Rate**: Requests per second
- **Error Rate**: Percentage of failed requests
- **User Experience**: Page load times, user satisfaction

### 2. Monitoring Tools

#### Application Performance Monitoring (APM)
```typescript
// New Relic integration
import { NewRelicInterceptor } from '@nestjs/newrelic';

@Module({
  imports: [
    NewRelicModule.forRoot({
      appName: 'Cardinal Platform',
      licenseKey: process.env.NEW_RELIC_LICENSE_KEY,
    }),
  ],
})
export class AppModule {}
```

#### Custom Metrics
```typescript
// Custom performance metrics
import { Counter, Histogram, register } from 'prom-client';

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Use in middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path, res.statusCode.toString())
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, req.route?.path, res.statusCode.toString())
      .inc();
  });
  
  next();
});
```

## Database Optimization

### 1. Query Optimization

#### Indexing Strategy
```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Composite indexes for complex queries
CREATE INDEX idx_payments_user_status ON payments(user_id, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
```

#### Query Analysis
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Check for slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

#### Query Optimization Techniques
```typescript
// Use select specific fields
const users = await this.userRepository.find({
  select: ['id', 'email', 'firstName', 'lastName'],
  where: { isActive: true }
});

// Use pagination for large datasets
const users = await this.userRepository.find({
  skip: (page - 1) * limit,
  take: limit,
  order: { createdAt: 'DESC' }
});

// Use joins instead of multiple queries
const usersWithPayments = await this.userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.payments', 'payment')
  .where('user.id = :id', { id: userId })
  .getOne();
```

### 2. Connection Pooling

```typescript
// Optimize database connections
const connection = await createConnection({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Payment, Notification],
  synchronize: false,
  logging: false,
  extra: {
    max: 20, // Maximum number of connections
    min: 5,  // Minimum number of connections
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 2000, // Connection timeout
    acquireTimeoutMillis: 60000, // Acquire connection timeout
  },
});
```

### 3. Database Caching

```typescript
// Redis caching for database queries
import { Cache } from 'cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findById(id: string): Promise<User> {
    const cacheKey = `user:${id}`;
    
    // Try to get from cache first
    let user = await this.cacheManager.get<User>(cacheKey);
    
    if (!user) {
      // If not in cache, get from database
      user = await this.userRepository.findOne({ where: { id } });
      
      if (user) {
        // Store in cache for 5 minutes
        await this.cacheManager.set(cacheKey, user, 300);
      }
    }
    
    return user;
  }
}
```

## Caching Strategies

### 1. Multi-Level Caching

#### Application-Level Caching
```typescript
// In-memory caching
import { Cache } from 'cache-manager';

@Injectable()
export class DataService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getExpensiveData(key: string): Promise<any> {
    const cacheKey = `expensive-data:${key}`;
    
    let data = await this.cacheManager.get(cacheKey);
    
    if (!data) {
      data = await this.computeExpensiveData(key);
      await this.cacheManager.set(cacheKey, data, 600); // 10 minutes
    }
    
    return data;
  }
}
```

#### Redis Caching
```typescript
// Redis for distributed caching
import { RedisService } from '@nestjs/redis';

@Injectable()
export class CacheService {
  constructor(private redisService: RedisService) {}

  async get(key: string): Promise<any> {
    const value = await this.redisService.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    await this.redisService.setex(key, ttl, JSON.stringify(value));
  }

  async del(key: string): Promise<void> {
    await this.redisService.del(key);
  }
}
```

### 2. Cache Invalidation

```typescript
// Smart cache invalidation
@Injectable()
export class UserService {
  async updateUser(id: string, updateData: UpdateUserDto): Promise<User> {
    // Update in database
    const user = await this.userRepository.update(id, updateData);
    
    // Invalidate related caches
    await this.cacheManager.del(`user:${id}`);
    await this.cacheManager.del('users:list');
    
    // Invalidate user-specific caches
    await this.invalidateUserCaches(id);
    
    return user;
  }

  private async invalidateUserCaches(userId: string): Promise<void> {
    const patterns = [
      `user:${userId}:*`,
      `dashboard:${userId}`,
      `payments:${userId}:*`,
    ];
    
    for (const pattern of patterns) {
      const keys = await this.redisService.keys(pattern);
      if (keys.length > 0) {
        await this.redisService.del(...keys);
      }
    }
  }
}
```

### 3. Cache Warming

```typescript
// Preload frequently accessed data
@Injectable()
export class CacheWarmingService {
  async warmUpCaches(): Promise<void> {
    // Warm up user caches
    const activeUsers = await this.userRepository.find({
      where: { isActive: true },
      select: ['id', 'email', 'firstName', 'lastName']
    });
    
    for (const user of activeUsers) {
      await this.cacheManager.set(`user:${user.id}`, user, 1800); // 30 minutes
    }
    
    // Warm up dashboard data for active users
    for (const user of activeUsers.slice(0, 100)) { // Limit to top 100 users
      await this.warmUpUserDashboard(user.id);
    }
  }

  private async warmUpUserDashboard(userId: string): Promise<void> {
    const dashboardData = await this.aggregationService.getDashboardData(userId);
    await this.cacheManager.set(`dashboard:${userId}`, dashboardData, 300); // 5 minutes
  }
}
```

## API Optimization

### 1. Response Compression

```typescript
// Enable gzip compression
import * as compression from 'compression';

app.use(compression({
  threshold: 1024, // Only compress responses larger than 1KB
  level: 6, // Compression level (1-9)
}));
```

### 2. Pagination

```typescript
// Implement efficient pagination
@Get('users')
async getUsers(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 20,
  @Query('sort') sort: string = 'createdAt',
  @Query('order') order: 'ASC' | 'DESC' = 'DESC',
): Promise<PaginatedResponse<User>> {
  const [users, total] = await this.userRepository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
    order: { [sort]: order },
  });

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}
```

### 3. Field Selection

```typescript
// Allow clients to specify required fields
@Get('users')
async getUsers(
  @Query('fields') fields?: string,
): Promise<User[]> {
  const selectFields = fields ? fields.split(',') : ['id', 'email', 'firstName', 'lastName'];
  
  return this.userRepository.find({
    select: selectFields as (keyof User)[],
  });
}
```

### 4. Batch Operations

```typescript
// Batch multiple operations
@Post('users/batch')
async createUsersBatch(@Body() users: CreateUserDto[]): Promise<User[]> {
  // Use transaction for atomicity
  return this.dataSource.transaction(async manager => {
    const userRepository = manager.getRepository(User);
    
    // Process in batches of 100
    const batchSize = 100;
    const results: User[] = [];
    
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const batchResults = await userRepository.save(batch);
      results.push(...batchResults);
    }
    
    return results;
  });
}
```

## Microservice Optimization

### 1. Service Communication

#### HTTP Optimization
```typescript
// Use HTTP/2 and connection pooling
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
      httpAgent: new http.Agent({
        keepAlive: true,
        maxSockets: 10,
      }),
    }),
  ],
})
export class AppModule {}
```

#### Message Queue Optimization
```typescript
// Optimize SQS message processing
@Injectable()
export class MessageProcessor {
  async processMessages(): Promise<void> {
    const messages = await this.sqsService.receiveMessages({
      MaxNumberOfMessages: 10, // Process up to 10 messages at once
      WaitTimeSeconds: 20, // Long polling
    });

    // Process messages in parallel
    await Promise.all(
      messages.map(message => this.processMessage(message))
    );
  }

  private async processMessage(message: any): Promise<void> {
    try {
      // Process message
      await this.handleMessage(message.Body);
      
      // Delete message after successful processing
      await this.sqsService.deleteMessage(message.ReceiptHandle);
    } catch (error) {
      // Handle error and potentially retry
      this.logger.error('Failed to process message', error);
    }
  }
}
```

### 2. Circuit Breaker Optimization

```typescript
// Optimize circuit breaker settings
@Injectable()
export class MicroserviceClient {
  private circuitBreaker = new CircuitBreaker(this.callService, {
    timeout: 5000, // 5 second timeout
    errorThresholdPercentage: 50, // Open circuit after 50% errors
    resetTimeout: 30000, // Try again after 30 seconds
    rollingCountTimeout: 10000, // Rolling window of 10 seconds
    rollingCountBuckets: 10, // 10 buckets in rolling window
  });

  async callService(endpoint: string, data: any): Promise<any> {
    // Implementation
  }
}
```

## Frontend Optimization

### 1. BFF Aggregation

```typescript
// Aggregate multiple API calls into one
@Get('dashboard')
async getDashboard(@Request() req): Promise<DashboardData> {
  // Use Promise.all for parallel execution
  const [user, payments, notifications] = await Promise.all([
    this.userService.getProfile(req.user.id),
    this.paymentService.getRecentPayments(req.user.id),
    this.notificationService.getUnreadNotifications(req.user.id),
  ]);

  return {
    user,
    recentPayments: payments,
    recentNotifications: notifications,
    stats: this.calculateStats(payments, notifications),
  };
}
```

### 2. Response Caching

```typescript
// Cache responses based on user and data freshness
@Get('dashboard')
@Cache('dashboard', 300) // Cache for 5 minutes
async getDashboard(@Request() req): Promise<DashboardData> {
  // Implementation
}

// Cache with dynamic keys
@Get('user/:id')
@Cache('user-${id}', 1800) // Cache for 30 minutes
async getUser(@Param('id') id: string): Promise<User> {
  // Implementation
}
```

## Load Balancing

### 1. Horizontal Scaling

```yaml
# Docker Compose for load balancing
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - user-service-1
      - user-service-2
      - user-service-3

  user-service-1:
    build: ./services/user-service
    environment:
      - NODE_ENV=production
      - PORT=3001

  user-service-2:
    build: ./services/user-service
    environment:
      - NODE_ENV=production
      - PORT=3002

  user-service-3:
    build: ./services/user-service
    environment:
      - NODE_ENV=production
      - PORT=3003
```

### 2. Nginx Configuration

```nginx
# nginx.conf
upstream user_service {
    server user-service-1:3001;
    server user-service-2:3002;
    server user-service-3:3003;
}

server {
    listen 80;
    
    location /api/users {
        proxy_pass http://user_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Enable keep-alive
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        
        # Timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
    }
}
```

## Memory Optimization

### 1. Memory Leak Prevention

```typescript
// Proper cleanup of resources
@Injectable()
export class DataService {
  private intervals: NodeJS.Timeout[] = [];

  onModuleDestroy() {
    // Clean up intervals
    this.intervals.forEach(interval => clearInterval(interval));
  }

  startPeriodicTask() {
    const interval = setInterval(() => {
      // Periodic task
    }, 60000);
    
    this.intervals.push(interval);
  }
}
```

### 2. Garbage Collection Optimization

```typescript
// Optimize object creation
class UserService {
  // Reuse objects instead of creating new ones
  private readonly defaultUserSelect = ['id', 'email', 'firstName', 'lastName'];

  async findUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: this.defaultUserSelect, // Reuse array
    });
  }

  // Use object pooling for frequently created objects
  private userPool: User[] = [];
  
  private getUserFromPool(): User {
    return this.userPool.pop() || new User();
  }
  
  private returnUserToPool(user: User): void {
    // Reset user properties
    Object.keys(user).forEach(key => delete user[key]);
    this.userPool.push(user);
  }
}
```

## Performance Testing

### 1. Load Testing

```typescript
// Load testing with Artillery
// artillery.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 20
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "API Load Test"
    weight: 100
    flow:
      - get:
          url: "/api/v1/dashboard"
          headers:
            Authorization: "Bearer {{ token }}"
      - think: 1
      - post:
          url: "/api/v1/payments"
          json:
            amount: 100
            currency: "USD"
```

### 2. Stress Testing

```bash
# Run load test
artillery run artillery.yml

# Run with custom configuration
artillery run artillery.yml --config config.json
```

## Monitoring and Alerting

### 1. Performance Alerts

```typescript
// Custom performance monitoring
@Injectable()
export class PerformanceMonitor {
  private metrics = new Map<string, number[]>();

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 values
    if (values.length > 100) {
      values.shift();
    }
    
    // Check for performance issues
    this.checkPerformanceThresholds(name, values);
  }

  private checkPerformanceThresholds(name: string, values: number[]): void {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    
    if (avg > 5000) { // 5 seconds
      this.logger.warn(`Performance issue detected: ${name} average ${avg}ms`);
      // Send alert
    }
  }
}
```

### 2. Health Checks

```typescript
// Comprehensive health checks
@Controller('health')
export class HealthController {
  @Get()
  async getHealth(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkExternalServices(),
    ]);

    const status = checks.every(check => check.status === 'fulfilled') 
      ? 'healthy' 
      : 'unhealthy';

    return {
      status,
      timestamp: new Date().toISOString(),
      checks: {
        database: checks[0].status === 'fulfilled' ? 'ok' : 'error',
        redis: checks[1].status === 'fulfilled' ? 'ok' : 'error',
        external: checks[2].status === 'fulfilled' ? 'ok' : 'error',
      },
    };
  }
}
```

## Best Practices

### 1. Performance-First Development

- **Measure First**: Always measure before optimizing
- **Profile Regularly**: Use profiling tools to identify bottlenecks
- **Monitor Continuously**: Set up monitoring and alerting
- **Test Performance**: Include performance tests in CI/CD

### 2. Code Optimization

- **Avoid N+1 Queries**: Use joins and batch loading
- **Minimize Object Creation**: Reuse objects where possible
- **Use Streaming**: For large datasets, use streaming
- **Optimize Loops**: Use efficient algorithms and data structures

### 3. Infrastructure Optimization

- **Right-Size Resources**: Use appropriate instance sizes
- **Enable Caching**: Use multiple levels of caching
- **Optimize Networks**: Use CDNs and compression
- **Monitor Costs**: Balance performance with cost

### 4. Continuous Improvement

- **Regular Reviews**: Review performance metrics regularly
- **A/B Testing**: Test performance improvements
- **User Feedback**: Monitor user experience metrics
- **Iterative Optimization**: Make small, incremental improvements
