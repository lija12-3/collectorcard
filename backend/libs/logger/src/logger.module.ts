import { Module, Global, DynamicModule } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';
import { LoggerConfig } from './interfaces/logger.interface';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(config: LoggerConfig): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'LoggerConfig',
          useValue: config,
        },
        {
          provide: AppLoggerService,
          useFactory: (config: LoggerConfig) => new AppLoggerService(config),
          inject: ['LoggerConfig'],
        },
      ],
      exports: [AppLoggerService],
    };
  }

  static forFeature() {
    return {
      module: LoggerModule,
      providers: [AppLoggerService],
      exports: [AppLoggerService],
    };
  }
}
