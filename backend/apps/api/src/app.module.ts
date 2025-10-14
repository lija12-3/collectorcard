import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@libs/database';
import { AuthModule } from '@libs/authentication';
import { LoggerModule } from '@libs/logger';
import { ErrorHandlerModule } from '@libs/error-handlers';
import { AuthController } from './auth.controller';
import { UserModule } from './modules';
import { CoreModule } from './core/core.module';
import {
  RequestLoggingMiddleware,
  CorsMiddleware,
  RateLimitingMiddleware,
} from './middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    CoreModule,
    DatabaseModule,
    UserModule,
    AuthModule.forFeature(),
    LoggerModule,
    ErrorHandlerModule,
  ],
  controllers: [AuthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes('*')
      .apply(RequestLoggingMiddleware)
      .forRoutes('*')
      .apply(RateLimitingMiddleware)
      .forRoutes('*');
  }
}
