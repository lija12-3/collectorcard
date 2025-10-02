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
exports.SNSService = void 0;
const common_1 = require("@nestjs/common");
const client_sns_1 = require("@aws-sdk/client-sns");
let SNSService = class SNSService {
    constructor(region = 'us-east-1') {
        this.region = region;
        this.snsClient = new client_sns_1.SNSClient({ region: this.region });
    }
    async publishMessage(topicArn, message) {
        try {
            const command = new client_sns_1.PublishCommand({
                TopicArn: topicArn,
                Subject: message.subject,
                Message: message.message,
                MessageAttributes: message.messageAttributes,
            });
            const result = await this.snsClient.send(command);
            return result.MessageId || '';
        }
        catch (error) {
            throw new Error(`Failed to publish message to SNS: ${error.message}`);
        }
    }
    async createTopic(topicName) {
        try {
            const command = new client_sns_1.CreateTopicCommand({
                Name: topicName,
            });
            const result = await this.snsClient.send(command);
            return result.TopicArn || '';
        }
        catch (error) {
            throw new Error(`Failed to create SNS topic: ${error.message}`);
        }
    }
    async subscribe(topicArn, subscription) {
        try {
            const command = new client_sns_1.SubscribeCommand({
                TopicArn: topicArn,
                Protocol: subscription.protocol,
                Endpoint: subscription.endpoint,
                Attributes: subscription.attributes,
            });
            const result = await this.snsClient.send(command);
            return result.SubscriptionArn || '';
        }
        catch (error) {
            throw new Error(`Failed to subscribe to SNS topic: ${error.message}`);
        }
    }
    async unsubscribe(subscriptionArn) {
        try {
            const command = new client_sns_1.UnsubscribeCommand({
                SubscriptionArn: subscriptionArn,
            });
            await this.snsClient.send(command);
        }
        catch (error) {
            throw new Error(`Failed to unsubscribe from SNS topic: ${error.message}`);
        }
    }
    async sendSMS(phoneNumber, message) {
        try {
            const command = new client_sns_1.PublishCommand({
                PhoneNumber: phoneNumber,
                Message: message,
            });
            const result = await this.snsClient.send(command);
            return result.MessageId || '';
        }
        catch (error) {
            throw new Error(`Failed to send SMS: ${error.message}`);
        }
    }
    async publishToMultipleTopics(topicArns, message) {
        const successful = [];
        const failed = [];
        for (const topicArn of topicArns) {
            try {
                const messageId = await this.publishMessage(topicArn, message);
                successful.push(messageId);
            }
            catch (error) {
                failed.push({ topicArn, error: error.message });
            }
        }
        return { successful, failed };
    }
};
exports.SNSService = SNSService;
exports.SNSService = SNSService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], SNSService);
//# sourceMappingURL=sns.service.js.map