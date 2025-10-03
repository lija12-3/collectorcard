export interface EmailMessage {
    to: string | string[];
    from: string;
    subject: string;
    text?: string;
    html?: string;
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
}
export interface RawEmailMessage {
    to: string | string[];
    from: string;
    rawMessage: Buffer;
}
export declare class SESService {
    private readonly region;
    private readonly sesClient;
    constructor(region?: string);
    sendEmail(message: EmailMessage): Promise<string>;
    sendRawEmail(message: RawEmailMessage): Promise<string>;
    getSendQuota(): Promise<{
        max24HourSend: number;
        maxSendRate: number;
        sentLast24Hours: number;
    }>;
    sendTemplatedEmail(templateName: string, templateData: Record<string, any>, message: Omit<EmailMessage, 'subject' | 'text' | 'html'>): Promise<string>;
    sendBulkEmail(messages: EmailMessage[]): Promise<{
        successful: string[];
        failed: {
            message: EmailMessage;
            error: string;
        }[];
    }>;
}
