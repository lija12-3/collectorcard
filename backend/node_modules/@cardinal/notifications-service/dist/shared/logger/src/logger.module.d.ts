import { DynamicModule } from '@nestjs/common';
import { CardinalLoggerService } from './cardinal-logger.service';
import { LoggerConfig } from './interfaces/logger.interface';
export declare class LoggerModule {
    static forRoot(config: LoggerConfig): DynamicModule;
    static forFeature(): {
        module: typeof LoggerModule;
        providers: (typeof CardinalLoggerService)[];
        exports: (typeof CardinalLoggerService)[];
    };
}
