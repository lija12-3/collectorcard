import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    create(createNotificationDto: CreateNotificationDto): Promise<import("../entities/notification.entity").Notification>;
    findAll(): Promise<import("../entities/notification.entity").Notification[]>;
    findMyNotifications(req: any): Promise<import("../entities/notification.entity").Notification[]>;
    findOne(id: string): Promise<import("../entities/notification.entity").Notification>;
    markAsRead(id: string): Promise<import("../entities/notification.entity").Notification>;
}
