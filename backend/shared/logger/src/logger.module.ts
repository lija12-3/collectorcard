import { Module, Global, DynamicModule } from '@nestjs/common';
import { CardinalLoggerService } from './cardinal-logger.service';
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
          provide: CardinalLoggerService,
          useFactory: (config: LoggerConfig) => new CardinalLoggerService(config),
          inject: ['LoggerConfig'],
        },
      ],
      exports: [CardinalLoggerService],
    };
  }

  static forFeature() {
    return {
      module: LoggerModule,
      providers: [CardinalLoggerService],
      exports: [CardinalLoggerService],
    };
  }
}
