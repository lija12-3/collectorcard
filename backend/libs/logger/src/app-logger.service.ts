import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { LogLevel, LogContext, LogEntry, LoggerConfig } from './interfaces/logger.interface';

@Injectable()
export class AppLoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor(private readonly config: LoggerConfig) {
    this.logger = this.createWinstonLogger();
  }

  private createWinstonLogger(): winston.Logger {
    const transports: winston.transport[] = [];

    // Console transport
    if (this.config.enableConsole !== false) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              const contextStr = context ? ` ${JSON.stringify(context)}` : '';
              return `${timestamp} [${level}] ${message}${contextStr}`;
            }),
          ),
        }),
      );
    }

    // File transport
    if (this.config.enableFile && this.config.filePath) {
      transports.push(
        new winston.transports.DailyRotateFile({
          filename: this.config.filePath,
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      );
    }

    return winston.createLogger({
      level: this.config.level,
      defaultMeta: { service: this.config.service },
      transports,
    });
  }

  log(message: string, context?: LogContext): void {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: LogContext): void {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: LogContext): void {
    this.logger.verbose(message, { context });
  }

  // Custom logging methods
  logWithLevel(level: LogLevel, message: string, context?: LogContext): void {
    this.logger.log(level, message, { context });
  }

  logEntry(entry: LogEntry): void {
    this.logger.log(entry.level, entry.message, {
      context: entry.context,
      timestamp: entry.timestamp,
      stack: entry.stack,
    });
  }

  // Structured logging for microservices
  logServiceCall(
    service: string,
    method: string,
    duration: number,
    success: boolean,
    context?: LogContext,
  ): void {
    this.logger.info(`Service call: ${service}.${method}`, {
      context: {
        ...context,
        service,
        method,
        duration,
        success,
      },
    });
  }

  logError(error: Error, context?: LogContext): void {
    this.logger.error(error.message, {
      context: {
        ...context,
        stack: error.stack,
        name: error.name,
      },
    });
  }
}
