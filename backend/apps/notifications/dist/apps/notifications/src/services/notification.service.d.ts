import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { SESService, SNSService, SQSService } from '@shared/aws';
import { CardinalLoggerService } from '@shared/logger';
import { TwilioService } from '@shared/utils';
export declare class NotificationService {
    private readonly notificationRepository;
    private readonly sesService;
    private readonly snsService;
    private readonly twilioService;
    private readonly logger;
    private readonly sqsService;
    constructor(notificationRepository: Repository<Notification>, sesService: SESService, snsService: SNSService, twilioService: TwilioService, logger: CardinalLoggerService, sqsService: SQSService);
    createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    findAll(): Promise<Notification[]>;
    findOne(id: string): Promise<Notification>;
    findByUserId(userId: string): Promise<Notification[]>;
    markAsRead(id: string): Promise<Notification>;
    private processNotification;
    private sendEmailNotification;
    private sendSMSNotification;
    private sendPushNotification;
    private sendInAppNotification;
    private updateNotificationStatus;
    handleSQSMessage(message: any): Promise<void>;
    private handlePaymentNotification;
    private handleUserRegistrationNotification;
}
