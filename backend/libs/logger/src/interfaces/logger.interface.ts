export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

export interface LogContext {
  service?: string;
  userId?: string;
  requestId?: string;
  correlationId?: string;
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp?: Date;
  stack?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  service: string;
  enableConsole?: boolean;
  enableFile?: boolean;
  enableCloudWatch?: boolean;
  filePath?: string;
  cloudWatchGroup?: string;
  cloudWatchStream?: string;
  region?: string;
}
