export declare enum NotificationType {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    IN_APP = "in_app"
}
export declare enum NotificationStatus {
    PENDING = "pending",
    SENT = "sent",
    FAILED = "failed",
    DELIVERED = "delivered",
    READ = "read"
}
export declare class Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    status: NotificationStatus;
    recipient: string;
    metadata?: Record<string, any>;
    externalId?: string;
    failureReason?: string;
    readAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
