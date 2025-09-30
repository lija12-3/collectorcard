import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationStatus, NotificationType } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { SESService, SNSService, SQSService } from '@shared/aws';
import { CardinalLoggerService } from '@shared/logger';
import { TwilioService } from '@shared/utils';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly sesService: SESService,
    private readonly snsService: SNSService,
    private readonly twilioService: TwilioService,
    private readonly logger: CardinalLoggerService,
    private readonly sqsService: SQSService,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    try {
      const notification = this.notificationRepository.create({
        ...createNotificationDto,
        status: NotificationStatus.PENDING,
      });

      const savedNotification = await this.notificationRepository.save(notification);

      // Process notification asynchronously
      this.processNotification(savedNotification);

      this.logger.log(`Notification created: ${savedNotification.id}`, {
        service: 'notification-service',
        notificationId: savedNotification.id,
        userId: savedNotification.userId,
        type: savedNotification.type,
      });

      return savedNotification;
    } catch (error) {
      this.logger.error(`Failed to create notification: ${error.message}`, error.stack, {
        service: 'notification-service',
        userId: createNotificationDto.userId,
      });
      throw error;
    }
  }

  async findAll(): Promise<Notification[]> {
    try {
      return await this.notificationRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`Failed to find all notifications: ${error.message}`, error.stack, {
        service: 'notification-service',
      });
      throw error;
    }
  }

  async findOne(id: string): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { id },
      });

      if (!notification) {
        throw new NotFoundException('Notification not found');
      }

      return notification;
    } catch (error) {
      this.logger.error(`Failed to find notification: ${error.message}`, error.stack, {
        service: 'notification-service',
        notificationId: id,
      });
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    try {
      return await this.notificationRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`Failed to find notifications by user: ${error.message}`, error.stack, {
        service: 'notification-service',
        userId,
      });
      throw error;
    }
  }

  async markAsRead(id: string): Promise<Notification> {
    try {
      const notification = await this.findOne(id);
      
      notification.status = NotificationStatus.READ;
      notification.readAt = new Date();

      const updatedNotification = await this.notificationRepository.save(notification);

      this.logger.log(`Notification marked as read: ${id}`, {
        service: 'notification-service',
        notificationId: id,
      });

      return updatedNotification;
    } catch (error) {
      this.logger.error(`Failed to mark notification as read: ${error.message}`, error.stack, {
        service: 'notification-service',
        notificationId: id,
      });
      throw error;
    }
  }

  private async processNotification(notification: Notification): Promise<void> {
    try {
      // Update status to processing
      notification.status = NotificationStatus.PENDING;
      await this.notificationRepository.save(notification);

      // Process based on notification type
      switch (notification.type) {
        case NotificationType.EMAIL:
          await this.sendEmailNotification(notification);
          break;
        case NotificationType.SMS:
          await this.sendSMSNotification(notification);
          break;
        case NotificationType.PUSH:
          await this.sendPushNotification(notification);
          break;
        case NotificationType.IN_APP:
          await this.sendInAppNotification(notification);
          break;
        default:
          throw new Error(`Unsupported notification type: ${notification.type}`);
      }
    } catch (error) {
      // Update notification status to failed
      await this.updateNotificationStatus(notification.id, NotificationStatus.FAILED, error.message);
      throw error;
    }
  }

  private async sendEmailNotification(notification: Notification): Promise<void> {
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
      notification.status = NotificationStatus.SENT;
      await this.notificationRepository.save(notification);

      this.logger.log(`Email notification sent: ${notification.id}`, {
        service: 'notification-service',
        notificationId: notification.id,
        messageId,
      });
    } catch (error) {
      this.logger.error(`Failed to send email notification: ${error.message}`, error.stack, {
        service: 'notification-service',
        notificationId: notification.id,
      });
      throw error;
    }
  }

  private async sendSMSNotification(notification: Notification): Promise<void> {
    try {
      const recipient = notification.recipient || notification.metadata?.phoneNumber;
      if (!recipient) {
        throw new Error('SMS recipient not provided');
      }

      const message = await this.twilioService.sendSMS(recipient, notification.message);

      notification.externalId = message.sid;
      notification.status = NotificationStatus.SENT;
      await this.notificationRepository.save(notification);

      this.logger.log(`SMS notification sent: ${notification.id}`, {
        service: 'notification-service',
        notificationId: notification.id,
        messageSid: message.sid,
      });
    } catch (error) {
      this.logger.error(`Failed to send SMS notification: ${error.message}`, error.stack, {
        service: 'notification-service',
        notificationId: notification.id,
      });
      throw error;
    }
  }

  private async sendPushNotification(notification: Notification): Promise<void> {
    try {
      // This would typically involve sending to a push notification service
      // For now, we'll simulate it
      notification.status = NotificationStatus.SENT;
      await this.notificationRepository.save(notification);

      this.logger.log(`Push notification sent: ${notification.id}`, {
        service: 'notification-service',
        notificationId: notification.id,
      });
    } catch (error) {
      this.logger.error(`Failed to send push notification: ${error.message}`, error.stack, {
        service: 'notification-service',
        notificationId: notification.id,
      });
      throw error;
    }
  }

  private async sendInAppNotification(notification: Notification): Promise<void> {
    try {
      // In-app notifications are typically stored in the database
      // and retrieved by the client application
      notification.status = NotificationStatus.SENT;
      await this.notificationRepository.save(notification);

      this.logger.log(`In-app notification created: ${notification.id}`, {
        service: 'notification-service',
        notificationId: notification.id,
      });
    } catch (error) {
      this.logger.error(`Failed to create in-app notification: ${error.message}`, error.stack, {
        service: 'notification-service',
        notificationId: notification.id,
      });
      throw error;
    }
  }

  private async updateNotificationStatus(
    id: string,
    status: NotificationStatus,
    failureReason?: string,
  ): Promise<void> {
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
    } catch (error) {
      this.logger.error(`Failed to update notification status: ${error.message}`, error.stack, {
        service: 'notification-service',
        notificationId: id,
      });
    }
  }

  // SQS Message Handler
  async handleSQSMessage(message: any): Promise<void> {
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
    } catch (error) {
      this.logger.error(`Failed to handle SQS message: ${error.message}`, error.stack, {
        service: 'notification-service',
      });
    }
  }

  private async handlePaymentNotification(data: any): Promise<void> {
    const { paymentId, userId, status, amount, currency } = data;

    await this.createNotification({
      userId,
      type: NotificationType.EMAIL,
      title: 'Payment Update',
      message: `Your payment of ${amount} ${currency} has been ${status}.`,
      metadata: { paymentId, status },
    });
  }

  private async handleUserRegistrationNotification(data: any): Promise<void> {
    const { userId, email } = data;

    await this.createNotification({
      userId,
      type: NotificationType.EMAIL,
      title: 'Welcome to Cardinal!',
      message: 'Thank you for registering with Cardinal. Welcome aboard!',
      recipient: email,
    });
  }
}
