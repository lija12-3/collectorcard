import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class CardinalConfigService {
  constructor(private configService: NestConfigService) {}

  // Database Configuration
  get database() {
    return {
      type: this.configService.get<string>('DB_TYPE', 'postgres'),
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME', 'postgres'),
      password: this.configService.get<string>('DB_PASSWORD', 'password'),
      database: this.configService.get<string>('DB_DATABASE', 'cardinal'),
      ssl: this.configService.get<boolean>('DB_SSL', false),
      synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE', false),
      logging: this.configService.get<boolean>('DB_LOGGING', false),
    };
  }

  // Redis Configuration
  get redis() {
    return {
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      db: this.configService.get<number>('REDIS_DB', 0),
    };
  }

  // JWT Configuration
  get jwt() {
    return {
      secret: this.configService.get<string>('JWT_SECRET', 'your-super-secret-jwt-key'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1h'),
      encryptionKey: this.configService.get<string>('ENCRYPTION_KEY', 'your-encryption-key-32-chars-long'),
    };
  }

  // AWS Configuration
  get aws() {
    return {
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    };
  }

  // Stripe Configuration
  get stripe() {
    return {
      secretKey: this.configService.get<string>('STRIPE_SECRET_KEY'),
      publishableKey: this.configService.get<string>('STRIPE_PUBLISHABLE_KEY'),
      webhookSecret: this.configService.get<string>('STRIPE_WEBHOOK_SECRET'),
      environment: this.configService.get<string>('NODE_ENV') === 'production' ? 'live' : 'test',
    };
  }

  // Twilio Configuration
  get twilio() {
    return {
      accountSid: this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      authToken: this.configService.get<string>('TWILIO_AUTH_TOKEN'),
      phoneNumber: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
    };
  }

  // Highnote Configuration
  get highnote() {
    return {
      apiKey: this.configService.get<string>('HIGHNOTE_API_KEY'),
      baseUrl: this.configService.get<string>('HIGHNOTE_BASE_URL', 'https://api.highnote.com'),
    };
  }

  // Cognito Configuration
  get cognito() {
    return {
      userPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      clientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      clientSecret: this.configService.get<string>('COGNITO_CLIENT_SECRET'),
    };
  }

  // Security Configuration
  get security() {
    return {
      corsOrigin: this.configService.get<string>('CORS_ORIGIN', 'http://localhost:3000'),
      rateLimitWindowMs: this.configService.get<number>('RATE_LIMIT_WINDOW_MS', 900000),
      rateLimitMax: this.configService.get<number>('RATE_LIMIT_MAX', 100),
    };
  }

  // Logging Configuration
  get logging() {
    return {
      level: this.configService.get<string>('LOG_LEVEL', 'info'),
      filePath: this.configService.get<string>('LOG_FILE_PATH', './logs/app.log'),
      maxSize: this.configService.get<string>('LOG_MAX_SIZE', '20m'),
      maxFiles: this.configService.get<string>('LOG_MAX_FILES', '14d'),
    };
  }

  // Health Check Configuration
  get healthCheck() {
    return {
      timeout: this.configService.get<number>('HEALTH_CHECK_TIMEOUT', 5000),
      interval: this.configService.get<number>('HEALTH_CHECK_INTERVAL', 30000),
    };
  }

  // Application Configuration
  get app() {
    return {
      name: this.configService.get<string>('APP_NAME', 'Cardinal'),
      version: this.configService.get<string>('APP_VERSION', '1.0.0'),
      port: this.configService.get<number>('PORT', 3000),
      environment: this.configService.get<string>('NODE_ENV', 'development'),
    };
  }
}
