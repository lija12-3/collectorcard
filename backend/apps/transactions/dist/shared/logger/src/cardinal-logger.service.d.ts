import { LoggerService as NestLoggerService } from '@nestjs/common';
import 'winston-daily-rotate-file';
import { LogLevel, LogContext, LogEntry, LoggerConfig } from './interfaces/logger.interface';
export declare class CardinalLoggerService implements NestLoggerService {
    private readonly config;
    private readonly logger;
    constructor(config: LoggerConfig);
    private createWinstonLogger;
    log(message: string, context?: LogContext): void;
    error(message: string, trace?: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    debug(message: string, context?: LogContext): void;
    verbose(message: string, context?: LogContext): void;
    logWithLevel(level: LogLevel, message: string, context?: LogContext): void;
    logEntry(entry: LogEntry): void;
    logServiceCall(service: string, method: string, duration: number, success: boolean, context?: LogContext): void;
    logError(error: Error, context?: LogContext): void;
}
