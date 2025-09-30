"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfigService = void 0;
class DatabaseConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    createTypeOrmOptions() {
        return {
            type: this.configService.get('DB_TYPE') || 'postgres',
            host: this.configService.get('DB_HOST') || 'localhost',
            port: this.configService.get('DB_PORT') || 5432,
            username: this.configService.get('DB_USERNAME') || 'postgres',
            password: this.configService.get('DB_PASSWORD') || 'password',
            database: this.configService.get('DB_DATABASE') || 'cardinal',
            ssl: this.configService.get('DB_SSL') || false,
            synchronize: this.configService.get('DB_SYNCHRONIZE') || false,
            logging: this.configService.get('DB_LOGGING') || false,
            entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
            migrations: [__dirname + '/../migrations/*{.ts,.js}'],
            subscribers: [__dirname + '/../subscribers/*{.ts,.js}'],
        };
    }
    createRedisOptions() {
        return {
            host: this.configService.get('REDIS_HOST') || 'localhost',
            port: this.configService.get('REDIS_PORT') || 6379,
            password: this.configService.get('REDIS_PASSWORD'),
            db: this.configService.get('REDIS_DB') || 0,
        };
    }
}
exports.DatabaseConfigService = DatabaseConfigService;
//# sourceMappingURL=database.config.js.map