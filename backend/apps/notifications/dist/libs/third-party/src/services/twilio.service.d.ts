export interface TwilioConfig {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
    environment: 'test' | 'live';
}
export interface TwilioMessage {
    sid: string;
    to: string;
    from: string;
    body: string;
    status: string;
    dateCreated: Date;
}
export declare class TwilioService {
    private readonly config;
    private readonly client;
    constructor(config: TwilioConfig);
    sendSMS(to: string, body: string): Promise<TwilioMessage>;
    sendWhatsApp(to: string, body: string): Promise<TwilioMessage>;
    makeCall(to: string, url: string): Promise<string>;
    getMessage(messageSid: string): Promise<TwilioMessage>;
    sendBulkSMS(recipients: string[], body: string): Promise<{
        successful: TwilioMessage[];
        failed: {
            recipient: string;
            error: string;
        }[];
    }>;
}
