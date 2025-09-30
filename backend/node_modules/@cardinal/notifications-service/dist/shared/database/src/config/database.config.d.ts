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
export declare class DatabaseConfigService {
    private configService;
    constructor(configService: ConfigService);
    createTypeOrmOptions(): TypeOrmModuleOptions;
    createRedisOptions(): {
        host: string;
        port: number;
        password: string;
        db: number;
    };
}
