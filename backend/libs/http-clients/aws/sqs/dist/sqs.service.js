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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQSService = void 0;
const common_1 = require("@nestjs/common");
const client_sqs_1 = require("@aws-sdk/client-sqs");
let SQSService = class SQSService {
    constructor(region = 'us-east-1') {
        this.region = region;
        this.sqsClient = new client_sqs_1.SQSClient({ region: this.region });
    }
    async sendMessage(queueUrl, messageBody, options) {
        try {
            const command = new client_sqs_1.SendMessageCommand({
                QueueUrl: queueUrl,
                MessageBody: messageBody,
                DelaySeconds: options?.delaySeconds,
                MessageAttributes: options?.messageAttributes,
                MessageGroupId: options?.messageGroupId,
                MessageDeduplicationId: options?.messageDeduplicationId,
            });
            const result = await this.sqsClient.send(command);
            return result.MessageId || '';
        }
        catch (error) {
            throw new Error(`Failed to send message to SQS: ${error.message}`);
        }
    }
    async receiveMessages(queueUrl, maxMessages = 10, waitTimeSeconds = 0) {
        try {
            const command = new client_sqs_1.ReceiveMessageCommand({
                QueueUrl: queueUrl,
                MaxNumberOfMessages: maxMessages,
                WaitTimeSeconds: waitTimeSeconds,
                MessageAttributeNames: ['All'],
                AttributeNames: ['All'],
            });
            const result = await this.sqsClient.send(command);
            return (result.Messages || []).map(message => ({
                id: message.MessageId || '',
                body: message.Body || '',
                attributes: message.Attributes,
                messageAttributes: message.MessageAttributes,
            }));
        }
        catch (error) {
            throw new Error(`Failed to receive messages from SQS: ${error.message}`);
        }
    }
    async deleteMessage(queueUrl, receiptHandle) {
        try {
            const command = new client_sqs_1.DeleteMessageCommand({
                QueueUrl: queueUrl,
                ReceiptHandle: receiptHandle,
            });
            await this.sqsClient.send(command);
        }
        catch (error) {
            throw new Error(`Failed to delete message from SQS: ${error.message}`);
        }
    }
    async getQueueUrl(queueName) {
        try {
            const command = new client_sqs_1.GetQueueUrlCommand({
                QueueName: queueName,
            });
            const result = await this.sqsClient.send(command);
            return result.QueueUrl || '';
        }
        catch (error) {
            throw new Error(`Failed to get queue URL: ${error.message}`);
        }
    }
    async sendBatchMessages(queueUrl, messages) {
        const successful = [];
        const failed = [];
        for (const message of messages) {
            try {
                const messageId = await this.sendMessage(queueUrl, message.body, {
                    messageAttributes: message.messageAttributes,
                });
                successful.push(messageId);
            }
            catch (error) {
                failed.push(message.id);
            }
        }
        return { successful, failed };
    }
};
exports.SQSService = SQSService;
exports.SQSService = SQSService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], SQSService);
//# sourceMappingURL=sqs.service.js.map