export interface SNSMessage {
    subject?: string;
    message: string;
    messageAttributes?: Record<string, any>;
}
export interface SNSSubscription {
    protocol: 'email' | 'sms' | 'sqs' | 'lambda' | 'http' | 'https';
    endpoint: string;
    attributes?: Record<string, string>;
}
export declare class SNSService {
    private readonly region;
    private readonly snsClient;
    constructor(region?: string);
    publishMessage(topicArn: string, message: SNSMessage): Promise<string>;
    createTopic(topicName: string): Promise<string>;
    subscribe(topicArn: string, subscription: SNSSubscription): Promise<string>;
    unsubscribe(subscriptionArn: string): Promise<void>;
    sendSMS(phoneNumber: string, message: string): Promise<string>;
    publishToMultipleTopics(topicArns: string[], message: SNSMessage): Promise<{
        successful: string[];
        failed: {
            topicArn: string;
            error: string;
        }[];
    }>;
}
