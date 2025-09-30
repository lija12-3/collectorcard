export interface SQSMessage {
    id: string;
    body: string;
    attributes?: Record<string, any>;
    messageAttributes?: Record<string, any>;
}
export interface SQSSendMessageOptions {
    delaySeconds?: number;
    messageAttributes?: Record<string, any>;
    messageGroupId?: string;
    messageDeduplicationId?: string;
}
export declare class SQSService {
    private readonly region;
    private readonly sqsClient;
    constructor(region?: string);
    sendMessage(queueUrl: string, messageBody: string, options?: SQSSendMessageOptions): Promise<string>;
    receiveMessages(queueUrl: string, maxMessages?: number, waitTimeSeconds?: number): Promise<SQSMessage[]>;
    deleteMessage(queueUrl: string, receiptHandle: string): Promise<void>;
    getQueueUrl(queueName: string): Promise<string>;
    sendBatchMessages(queueUrl: string, messages: Array<{
        id: string;
        body: string;
        messageAttributes?: Record<string, any>;
    }>): Promise<{
        successful: string[];
        failed: string[];
    }>;
}
