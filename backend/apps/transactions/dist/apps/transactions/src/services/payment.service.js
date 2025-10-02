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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../entities/payment.entity");
const utils_1 = require("../../../../shared/utils");
const logger_1 = require("../../../../shared/logger");
const aws_1 = require("../../../../shared/aws");
let PaymentService = class PaymentService {
    constructor(paymentRepository, stripeService, logger, sqsService) {
        this.paymentRepository = paymentRepository;
        this.stripeService = stripeService;
        this.logger = logger;
        this.sqsService = sqsService;
    }
    async createPayment(createPaymentDto) {
        try {
            const payment = this.paymentRepository.create({
                ...createPaymentDto,
                status: payment_entity_1.PaymentStatus.PENDING,
            });
            const savedPayment = await this.paymentRepository.save(payment);
            await this.processPayment(savedPayment);
            this.logger.log(`Payment created: ${savedPayment.id}`, {
                service: 'payment-service',
                paymentId: savedPayment.id,
                userId: savedPayment.userId,
                amount: savedPayment.amount,
            });
            return savedPayment;
        }
        catch (error) {
            this.logger.error(`Failed to create payment: ${error.message}`, error.stack, {
                service: 'payment-service',
                userId: createPaymentDto.userId,
            });
            throw error;
        }
    }
    async findAll() {
        try {
            return await this.paymentRepository.find({
                order: { createdAt: 'DESC' },
            });
        }
        catch (error) {
            this.logger.error(`Failed to find all payments: ${error.message}`, error.stack, {
                service: 'payment-service',
            });
            throw error;
        }
    }
    async findOne(id) {
        try {
            const payment = await this.paymentRepository.findOne({
                where: { id },
            });
            if (!payment) {
                throw new common_1.NotFoundException('Payment not found');
            }
            return payment;
        }
        catch (error) {
            this.logger.error(`Failed to find payment: ${error.message}`, error.stack, {
                service: 'payment-service',
                paymentId: id,
            });
            throw error;
        }
    }
    async findByUserId(userId) {
        try {
            return await this.paymentRepository.find({
                where: { userId },
                order: { createdAt: 'DESC' },
            });
        }
        catch (error) {
            this.logger.error(`Failed to find payments by user: ${error.message}`, error.stack, {
                service: 'payment-service',
                userId,
            });
            throw error;
        }
    }
    async updateStatus(id, status, failureReason) {
        try {
            const payment = await this.findOne(id);
            payment.status = status;
            if (failureReason) {
                payment.failureReason = failureReason;
            }
            const updatedPayment = await this.paymentRepository.save(payment);
            await this.sendPaymentNotification(updatedPayment);
            this.logger.log(`Payment status updated: ${id} to ${status}`, {
                service: 'payment-service',
                paymentId: id,
                status,
            });
            return updatedPayment;
        }
        catch (error) {
            this.logger.error(`Failed to update payment status: ${error.message}`, error.stack, {
                service: 'payment-service',
                paymentId: id,
            });
            throw error;
        }
    }
    async processPayment(payment) {
        try {
            payment.status = payment_entity_1.PaymentStatus.PROCESSING;
            await this.paymentRepository.save(payment);
            switch (payment.paymentMethod) {
                case 'card':
                    await this.processCardPayment(payment);
                    break;
                case 'bank_transfer':
                    await this.processBankTransfer(payment);
                    break;
                case 'digital_wallet':
                    await this.processDigitalWallet(payment);
                    break;
                default:
                    throw new Error(`Unsupported payment method: ${payment.paymentMethod}`);
            }
        }
        catch (error) {
            await this.updateStatus(payment.id, payment_entity_1.PaymentStatus.FAILED, error.message);
            throw error;
        }
    }
    async processCardPayment(payment) {
        try {
            const paymentIntent = await this.stripeService.createPaymentIntent(Math.round(payment.amount * 100), payment.currency, payment.userId, {
                paymentId: payment.id,
                description: payment.description,
            });
            payment.externalPaymentId = paymentIntent.id;
            payment.status = payment_entity_1.PaymentStatus.COMPLETED;
            await this.paymentRepository.save(payment);
            this.logger.log(`Card payment processed: ${payment.id}`, {
                service: 'payment-service',
                paymentId: payment.id,
                stripePaymentIntentId: paymentIntent.id,
            });
        }
        catch (error) {
            this.logger.error(`Failed to process card payment: ${error.message}`, error.stack, {
                service: 'payment-service',
                paymentId: payment.id,
            });
            throw error;
        }
    }
    async processBankTransfer(payment) {
        payment.status = payment_entity_1.PaymentStatus.PROCESSING;
        await this.paymentRepository.save(payment);
        this.logger.log(`Bank transfer initiated: ${payment.id}`, {
            service: 'payment-service',
            paymentId: payment.id,
        });
    }
    async processDigitalWallet(payment) {
        payment.status = payment_entity_1.PaymentStatus.PROCESSING;
        await this.paymentRepository.save(payment);
        this.logger.log(`Digital wallet payment initiated: ${payment.id}`, {
            service: 'payment-service',
            paymentId: payment.id,
        });
    }
    async sendPaymentNotification(payment) {
        try {
            const queueUrl = process.env.PAYMENT_NOTIFICATION_QUEUE_URL;
            if (!queueUrl) {
                this.logger.warn('Payment notification queue URL not configured', {
                    service: 'payment-service',
                });
                return;
            }
            const message = {
                type: 'payment_status_update',
                paymentId: payment.id,
                userId: payment.userId,
                status: payment.status,
                amount: payment.amount,
                currency: payment.currency,
                timestamp: new Date().toISOString(),
            };
            await this.sqsService.sendMessage(queueUrl, JSON.stringify(message));
            this.logger.log(`Payment notification sent: ${payment.id}`, {
                service: 'payment-service',
                paymentId: payment.id,
                status: payment.status,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send payment notification: ${error.message}`, error.stack, {
                service: 'payment-service',
                paymentId: payment.id,
            });
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        utils_1.StripeService,
        logger_1.CardinalLoggerService,
        aws_1.SQSService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map