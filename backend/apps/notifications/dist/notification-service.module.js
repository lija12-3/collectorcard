"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationServiceModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const notification_service_1 = require("./services/notification.service");
const notification_controller_1 = require("./controllers/notification.controller");
const auth_1 = require("@cardinal/auth");
const database_1 = require("@cardinal/database");
const logger_1 = require("@cardinal/logger");
const aws_ses_1 = require("@cardinal/aws-ses");
const aws_sns_1 = require("@cardinal/aws-sns");
const aws_sqs_1 = require("@cardinal/aws-sqs");
const third_party_1 = require("@cardinal/third-party");
let NotificationServiceModule = class NotificationServiceModule {
};
exports.NotificationServiceModule = NotificationServiceModule;
exports.NotificationServiceModule = NotificationServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            database_1.DatabaseModule,
            typeorm_1.TypeOrmModule.forFeature([notification_entity_1.Notification]),
            auth_1.AuthModule.forRoot({
                config: {
                    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
                    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
                    encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key-32-chars-long',
                },
            }),
            logger_1.LoggerModule.forRoot({
                level: 'info',
                service: 'notification-service',
                enableConsole: true,
                enableFile: true,
                filePath: './logs/notification-service.log',
            }),
            aws_ses_1.SESModule.forRoot(process.env.AWS_REGION || 'us-east-1'),
            aws_sns_1.SNSModule.forRoot(process.env.AWS_REGION || 'us-east-1'),
            aws_sqs_1.SQSModule.forRoot(process.env.AWS_REGION || 'us-east-1'),
            third_party_1.ThirdPartyModule.forRoot({
                twilio: {
                    accountSid: process.env.TWILIO_ACCOUNT_SID,
                    authToken: process.env.TWILIO_AUTH_TOKEN,
                    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
                    environment: process.env.NODE_ENV === 'production' ? 'live' : 'test',
                },
            }),
        ],
        controllers: [notification_controller_1.NotificationController],
        providers: [notification_service_1.NotificationService],
        exports: [notification_service_1.NotificationService],
    })
], NotificationServiceModule);
//# sourceMappingURL=notification-service.module.js.map