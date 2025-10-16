import { defineConfig } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const config = defineConfig({
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  user: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', ''),
  dbName: configService.get<string>('DB_DATABASE', 'appdb'),
  // SSL configuration for PostgreSQL
  ...(configService.get<boolean>('DB_SSL', false) && {
    ssl: { rejectUnauthorized: false },
  }),
  debug: configService.get<boolean>('DB_LOGGING', false),
  entities: ['dist/libs/database/src/entities/*.entity.js'],
  entitiesTs: ['libs/database/src/entities/*.entity.ts'],
  migrations: {
    path: 'dist/libs/database/src/migrations',
    pathTs: 'libs/database/src/migrations',
  },
  allowGlobalContext: true,
  // Read replica configuration
  replicas: configService.get<string>('DB_READ_HOST')
    ? [
        {
          host: configService.get<string>('DB_READ_HOST'),
          port: configService.get<number>(
            'DB_READ_PORT',
            configService.get<number>('DB_PORT', 5432),
          ),
          user: configService.get<string>(
            'DB_READ_USERNAME',
            configService.get<string>('DB_USERNAME', 'postgres'),
          ),
          password: configService.get<string>(
            'DB_READ_PASSWORD',
            configService.get<string>('DB_PASSWORD', ''),
          ),
          dbName: configService.get<string>('DB_DATABASE', 'appdb'),
        },
      ]
    : undefined,
});

export default config;
