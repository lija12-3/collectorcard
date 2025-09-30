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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../entities/notification.entity");
const aws_1 = require("../../../../shared/aws");
const logger_1 = require("../../../../shared/logger");
const utils_1 = require("../../../../shared/utils");
let NotificationService = class NotificationService {
    constructor(notificationRepository, sesService, snsService, twilioService, logger, sqsService) {
        this.notificationRepository = notificationRepository;
        this.sesService = sesService;
        this.snsService = snsService;
        this.twilioService = twilioService;
        this.logger = logger;
        this.sqsService = sqsService;
    }
    async createNotification(createNotificationDto) {
        try {
            const notification = this.notificationRepository.create({
                ...createNotificationDto,
                status: notification_entity_1.NotificationStatus.PENDING,
            });
            const savedNotification = await this.notificationRepository.save(notification);
            this.processNotification(savedNotification);
            this.logger.log(`Notification created: ${savedNotification.id}`, {
                service: 'notification-service',
                notificationId: savedNotification.id,
                userId: savedNotification.userId,
                type: savedNotification.type,
            });
            return savedNotification;
        }
        catch (error) {
            this.logger.error(`Failed to create notification: ${error.message}`, error.stack, {
                service: 'notification-service',
                userId: createNotificationDto.userId,
            });
            throw error;
        }
    }
    async findAll() {
        try {
            return await this.notificationRepository.find({
                order: { createdAt: 'DESC' },
            });
        }
        catch (error) {
            this.logger.error(`Failed to find all notifications: ${error.message}`, error.stack, {
                service: 'notification-service',
            });
            throw error;
        }
    }
    async findOne(id) {
        try {
            const notification = await this.notificationRepository.findOne({
                where: { id },
            });
            if (!notification) {
                throw new common_1.NotFoundException('Notification not found');
            }
            return notification;
        }
        catch (error) {
            this.logger.error(`Failed to find notification: ${error.message}`, error.stack, {
                service: 'notification-service',
                notificationId: id,
            });
            throw error;
        }
    }
    async findByUserId(userId) {
        try {
            return await this.notificationRepository.find({
                where: { userId },
                order: { createdAt: 'DESC' },
            });
        }
        catch (error) {
            this.logger.error(`Failed to find notifications by user: ${error.message}`, error.stack, {
                service: 'notification-service',
                userId,
            });
            throw error;
        }
    }
    async markAsRead(id) {
        try {
            const notification = await this.findOne(id);
            notification.status = notification_entity_1.NotificationStatus.READ;
            notification.readAt = new Date();
            const updatedNotification = await this.notificationRepository.save(notification);
            this.logger.log(`Notification marked as read: ${id}`, {
                service: 'notification-service',
                notificationId: id,
            });
            return updatedNotification;
        }
        catch (error) {
            this.logger.error(`Failed to mark notification as read: ${error.message}`, error.stack, {
                service: 'notification-service',
                notificationId: id,
            });
            throw error;
        }
    }
    async processNotification(notification) {
        try {
            notification.status = notification_entity_1.NotificationStatus.PENDING;
            await this.notificationRepository.save(notification);
            switch (notification.type) {
                case notification_entity_1.NotificationType.EMAIL:
                    await this.sendEmailNotification(notification);
                    break;
                case notification_entity_1.NotificationType.SMS:
                    await this.sendSMSNotification(notification);
                    break;
                case notification_entity_1.NotificationType.PUSH:
                    await this.sendPushNotification(notification);
                    break;
                case notification_entity_1.NotificationType.IN_APP:
                    await this.sendInAppNotification(notification);
                    break;
                default:
                    throw new Error(`Unsupported notification type: ${notification.type}`);
            }
        }
        catch (error) {
            await this.updateNotificationStatus(notification.id, notification_entity_1.NotificationStatus.FAILED, error.message);
            throw error;
        }
    }
    async sendEmailNotification(notification) {
        try {
            const recipient = notification.recipient || notification.metadata?.email;
            if (!recipient) {
                throw new Error('Email recipient not provided');
            }
            const messageId = await this.sesService.sendEmail({
                to: recipient,
                from: process.env.FROM_EMAIL || 'noreply@cardinal.com',
                subject: notification.title,
                html: notification.message,
            });
            notification.externalId = messageId;
            notification.status = notification_entity_1.NotificationStatus.SENT;
            await this.notificationRepository.save(notification);
            this.logger.log(`Email notification sent: ${notification.id}`, {
                service: 'notification-service',
                notificationId: notification.id,
                messageId,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send email notification: ${error.message}`, error.stack, {
                service: 'notification-service',
                notificationId: notification.id,
            });
            throw error;
        }
    }
    async sendSMSNotification(notification) {
        try {
            const recipient = notification.recipient || notification.metadata?.phoneNumber;
            if (!recipient) {
                throw new Error('SMS recipient not provided');
            }
            const message = await this.twilioService.sendSMS(recipient, notification.message);
            notification.externalId = message.sid;
            notification.status = notification_entity_1.NotificationStatus.SENT;
            await this.notificationRepository.save(notification);
            this.logger.log(`SMS notification sent: ${notification.id}`, {
                service: 'notification-service',
                notificationId: notification.id,
                messageSid: message.sid,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send SMS notification: ${error.message}`, error.stack, {
                service: 'notification-service',
                notificationId: notification.id,
            });
            throw error;
        }
    }
    async sendPushNotification(notification) {
        try {
            notification.status = notification_entity_1.NotificationStatus.SENT;
            await this.notificationRepository.save(notification);
            this.logger.log(`Push notification sent: ${notification.id}`, {
                service: 'notification-service',
                notificationId: notification.id,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send push notification: ${error.message}`, error.stack, {
                service: 'notification-service',
                notificationId: notification.id,
            });
            throw error;
        }
    }
    async sendInAppNotification(notification) {
        try {
            notification.status = notification_entity_1.NotificationStatus.SENT;
            await this.notificationRepository.save(notification);
            this.logger.log(`In-app notification created: ${notification.id}`, {
                service: 'notification-service',
                notificationId: notification.id,
            });
        }
        catch (error) {
            this.logger.error(`Failed to create in-app notification: ${error.message}`, error.stack, {
                service: 'notification-service',
                notificationId: notification.id,
            });
            throw error;
        }
    }
    async updateNotificationStatus(id, status, failureReason) {
        try {
            const notification = await this.notificationRepository.findOne({
                where: { id },
            });
            if (notification) {
                notification.status = status;
                if (failureReason) {
                    notification.failureReason = failureReason;
                }
                await this.notificationRepository.save(notification);
            }
        }
        catch (error) {
            this.logger.error(`Failed to update notification status: ${error.message}`, error.stack, {
                service: 'notification-service',
                notificationId: id,
            });
        }
    }
    async handleSQSMessage(message) {
        try {
            const { type, ...data } = JSON.parse(message.body);
            switch (type) {
                case 'payment_status_update':
                    await this.handlePaymentNotification(data);
                    break;
                case 'user_registration':
                    await this.handleUserRegistrationNotification(data);
                    break;
                default:
                    this.logger.warn(`Unknown message type: ${type}`, {
                        service: 'notification-service',
                    });
            }
        }
        catch (error) {
            this.logger.error(`Failed to handle SQS message: ${error.message}`, error.stack, {
                service: 'notification-service',
            });
        }
    }
    async handlePaymentNotification(data) {
        const { paymentId, userId, status, amount, currency } = data;
        await this.createNotification({
            userId,
            type: notification_entity_1.NotificationType.EMAIL,
            title: 'Payment Update',
            message: `Your payment of ${amount} ${currency} has been ${status}.`,
            metadata: { paymentId, status },
        });
    }
    async handleUserRegistrationNotification(data) {
        const { userId, email } = data;
        await this.createNotification({
            userId,
            type: notification_entity_1.NotificationType.EMAIL,
            title: 'Welcome to Cardinal!',
            message: 'Thank you for registering with Cardinal. Welcome aboard!',
            recipient: email,
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        aws_1.SESService,
        aws_1.SNSService,
        utils_1.TwilioService,
        logger_1.CardinalLoggerService,
        aws_1.SQSService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map