import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { Options } from '@mikro-orm/core';

export interface DatabaseConfig {
  type: 'mysql' | 'postgresql' | 'sqlite' | 'mongo';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl?: boolean;
  synchronize?: boolean;
  logging?: boolean;
  entities?: string[];
  migrations?: string[];
  subscribers?: string[];
  readHost?: string;
  readPort?: number;
  readUsername?: string;
  readPassword?: string;
}

export class DatabaseConfigService {
  constructor(private readonly configService: ConfigService) {}

  createMikroOrmOptions(): MikroOrmModuleOptions {
    const baseConfig = {
      type: this.configService.get<string>('DB_TYPE') as any || 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      dbName: this.configService.get<string>('DB_DATABASE'),
      ssl: this.configService.get<boolean>('DB_SSL') ? { rejectUnauthorized: false } : false,
      debug: this.configService.get<boolean>('DB_LOGGING') || false,
      entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
      migrations: {
        path: __dirname + '/../migrations',
        pattern: /^[\w-]+\d+\.(ts|js)$/,
      },
      allowGlobalContext: true,
    };

    // Add read replica configuration if available
    const readHost = this.configService.get<string>('DB_READ_HOST');
    if (readHost) {
      return {
        ...baseConfig,
        replicas: [
          {
            host: readHost,
            port: this.configService.get<number>('DB_READ_PORT') || baseConfig.port,
            user: this.configService.get<string>('DB_READ_USERNAME') || baseConfig.user,
            password: this.configService.get<string>('DB_READ_PASSWORD') || baseConfig.password,
            dbName: baseConfig.dbName,
          },
        ],
      };
    }

    return baseConfig;
  }

  createRedisOptions() {
    return {
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      db: this.configService.get<number>('REDIS_DB'),
    };
  }
}
