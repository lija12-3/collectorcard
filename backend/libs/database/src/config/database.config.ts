import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export interface DatabaseConfig {
  type: 'postgres' | 'mysql' | 'sqlite' | 'mongodb';
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
}

export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<string>('DB_TYPE') as any || 'postgres',
      host: this.configService.get<string>('DB_HOST') || 'localhost',
      port: this.configService.get<number>('DB_PORT') || 5432,
      username: this.configService.get<string>('DB_USERNAME') || 'postgres',
      password: this.configService.get<string>('DB_PASSWORD') || 'password',
      database: this.configService.get<string>('DB_DATABASE') || 'cardinal',
      ssl: this.configService.get<boolean>('DB_SSL') || false,
      synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE') || false,
      logging: this.configService.get<boolean>('DB_LOGGING') || false,
      entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      subscribers: [__dirname + '/../subscribers/*{.ts,.js}'],
    };
  }

  createRedisOptions() {
    return {
      host: this.configService.get<string>('REDIS_HOST') || 'localhost',
      port: this.configService.get<number>('REDIS_PORT') || 6379,
      password: this.configService.get<string>('REDIS_PASSWORD'),
      db: this.configService.get<number>('REDIS_DB') || 0,
    };
  }
}
