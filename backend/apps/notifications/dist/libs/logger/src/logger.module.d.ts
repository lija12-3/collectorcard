import { CardinalLoggerService } from './cardinal-logger.service';
import { LoggerConfig } from './interfaces/logger.interface';
export declare class LoggerModule {
    static forRoot(config: LoggerConfig): {
        module: typeof LoggerModule;
        providers: ({
            provide: string;
            useValue: LoggerConfig;
            useFactory?: undefined;
            inject?: undefined;
        } | {
            provide: typeof CardinalLoggerService;
            useFactory: (config: LoggerConfig) => CardinalLoggerService;
            inject: string[];
            useValue?: undefined;
        })[];
        exports: (typeof CardinalLoggerService)[];
    };
    static forFeature(): {
        module: typeof LoggerModule;
        providers: (typeof CardinalLoggerService)[];
        exports: (typeof CardinalLoggerService)[];
    };
}
