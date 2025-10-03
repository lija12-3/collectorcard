"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServiceModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const payment_service_1 = require("./services/payment.service");
const payment_controller_1 = require("./controllers/payment.controller");
const auth_1 = require("@cardinal/auth");
const database_1 = require("@cardinal/database");
const logger_1 = require("@cardinal/logger");
const aws_sqs_1 = require("@cardinal/aws-sqs");
const third_party_1 = require("@cardinal/third-party");
let PaymentServiceModule = class PaymentServiceModule {
};
exports.PaymentServiceModule = PaymentServiceModule;
exports.PaymentServiceModule = PaymentServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            database_1.DatabaseModule,
            typeorm_1.TypeOrmModule.forFeature([payment_entity_1.Payment]),
            auth_1.AuthModule.forRoot({
                config: {
                    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
                    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
                    encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key-32-chars-long',
                },
            }),
            logger_1.LoggerModule.forRoot({
                level: 'info',
                service: 'payment-service',
                enableConsole: true,
                enableFile: true,
                filePath: './logs/payment-service.log',
            }),
            aws_sqs_1.SQSModule.forRoot(process.env.AWS_REGION || 'us-east-1'),
            third_party_1.ThirdPartyModule.forRoot({
                stripe: {
                    secretKey: process.env.STRIPE_SECRET_KEY,
                    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
                    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                    environment: process.env.NODE_ENV === 'production' ? 'live' : 'test',
                },
            }),
        ],
        controllers: [payment_controller_1.PaymentController],
        providers: [payment_service_1.PaymentService],
        exports: [payment_service_1.PaymentService],
    })
], PaymentServiceModule);
//# sourceMappingURL=payment-service.module.js.map