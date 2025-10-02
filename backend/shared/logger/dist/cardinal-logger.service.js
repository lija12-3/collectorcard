"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardinalLoggerService = void 0;
const common_1 = require("@nestjs/common");
const winston = require("winston");
require("winston-daily-rotate-file");
let CardinalLoggerService = class CardinalLoggerService {
    constructor(config) {
        this.config = config;
        this.logger = this.createWinstonLogger();
    }
    createWinstonLogger() {
        const transports = [];
        if (this.config.enableConsole !== false) {
            transports.push(new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), winston.format.printf(({ timestamp, level, message, context }) => {
                    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
                    return `${timestamp} [${level}] ${message}${contextStr}`;
                })),
            }));
        }
        if (this.config.enableFile && this.config.filePath) {
            transports.push(new winston.transports.DailyRotateFile({
                filename: this.config.filePath,
                datePattern: 'YYYY-MM-DD',
                maxSize: '20m',
                maxFiles: '14d',
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            }));
        }
        return winston.createLogger({
            level: this.config.level,
            defaultMeta: { service: this.config.service },
            transports,
        });
    }
    log(message, context) {
        this.logger.info(message, { context });
    }
    error(message, trace, context) {
        this.logger.error(message, { trace, context });
    }
    warn(message, context) {
        this.logger.warn(message, { context });
    }
    debug(message, context) {
        this.logger.debug(message, { context });
    }
    verbose(message, context) {
        this.logger.verbose(message, { context });
    }
    logWithLevel(level, message, context) {
        this.logger.log(level, message, { context });
    }
    logEntry(entry) {
        this.logger.log(entry.level, entry.message, {
            context: entry.context,
            timestamp: entry.timestamp,
            stack: entry.stack,
        });
    }
    logServiceCall(service, method, duration, success, context) {
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
    logError(error, context) {
        this.logger.error(error.message, {
            context: {
                ...context,
                stack: error.stack,
                name: error.name,
            },
        });
    }
};
exports.CardinalLoggerService = CardinalLoggerService;
exports.CardinalLoggerService = CardinalLoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], CardinalLoggerService);
//# sourceMappingURL=cardinal-logger.service.js.map