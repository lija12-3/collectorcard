import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: NestConfigService) {}

  // Database Configuration
  get database() {
    return {
      type: this.configService.get<string>('DB_TYPE'),
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      ssl: this.configService.get<boolean>('DB_SSL', false),
      synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE', false),
      logging: this.configService.get<boolean>('DB_LOGGING', false),
    };
  }

  // Redis Configuration
  get redis() {
    return {
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      db: this.configService.get<number>('REDIS_DB', 0),
    };
  }

  // JWT Configuration
  get jwt() {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1h'),
      encryptionKey: this.configService.get<string>('ENCRYPTION_KEY'),
    };
  }

  // AWS Configuration
  get aws() {
    return {
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
    };
  }

  // Highnote Configuration
  get highnote() {
    return {
      apiKey: this.configService.get<string>('HIGHNOTE_API_KEY'),
      baseUrl: this.configService.get<string>(
        'HIGHNOTE_BASE_URL',
        'https://api.highnote.com',
      ),
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
      corsOrigin: this.configService.get<string>(
        'CORS_ORIGIN',
        'http://localhost:3000',
      ),
      rateLimitWindowMs: this.configService.get<number>(
        'RATE_LIMIT_WINDOW_MS',
        900000,
      ),
      rateLimitMax: this.configService.get<number>('RATE_LIMIT_MAX', 100),
    };
  }

  // Logging Configuration
  get logging() {
    return {
      level: this.configService.get<string>('LOG_LEVEL', 'info'),
      filePath: this.configService.get<string>(
        'LOG_FILE_PATH',
        './logs/app.log',
      ),
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
      name: this.configService.get<string>('APP_NAME', 'CollectorsCard'),
      version: this.configService.get<string>('APP_VERSION', '1.0.0'),
      port: this.configService.get<number>('PORT', 3000),
      environment: this.configService.get<string>('NODE_ENV', 'development'),
    };
  }
}
