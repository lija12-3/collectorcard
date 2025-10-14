import { Injectable } from '@nestjs/common';
import {
  SNSClient,
  PublishCommand,
  CreateTopicCommand,
  SubscribeCommand,
  UnsubscribeCommand,
} from '@aws-sdk/client-sns';

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

@Injectable()
export class SNSService {
  private readonly snsClient: SNSClient;

  constructor(private readonly region: string = 'us-east-1') {
    this.snsClient = new SNSClient({ region: this.region });
  }

  async publishMessage(topicArn: string, message: SNSMessage): Promise<string> {
    try {
      const command = new PublishCommand({
        TopicArn: topicArn,
        Subject: message.subject,
        Message: message.message,
        MessageAttributes: message.messageAttributes,
      });

      const result = await this.snsClient.send(command);
      return result.MessageId || '';
    } catch (error) {
      throw new Error(`Failed to publish message to SNS: ${error.message}`);
    }
  }

  async createTopic(topicName: string): Promise<string> {
    try {
      const command = new CreateTopicCommand({
        Name: topicName,
      });

      const result = await this.snsClient.send(command);
      return result.TopicArn || '';
    } catch (error) {
      throw new Error(`Failed to create SNS topic: ${error.message}`);
    }
  }

  async subscribe(
    topicArn: string,
    subscription: SNSSubscription,
  ): Promise<string> {
    try {
      const command = new SubscribeCommand({
        TopicArn: topicArn,
        Protocol: subscription.protocol,
        Endpoint: subscription.endpoint,
        Attributes: subscription.attributes,
      });

      const result = await this.snsClient.send(command);
      return result.SubscriptionArn || '';
    } catch (error) {
      throw new Error(`Failed to subscribe to SNS topic: ${error.message}`);
    }
  }

  async unsubscribe(subscriptionArn: string): Promise<void> {
    try {
      const command = new UnsubscribeCommand({
        SubscriptionArn: subscriptionArn,
      });

      await this.snsClient.send(command);
    } catch (error) {
      throw new Error(`Failed to unsubscribe from SNS topic: ${error.message}`);
    }
  }

  async sendSMS(phoneNumber: string, message: string): Promise<string> {
    try {
      const command = new PublishCommand({
        PhoneNumber: phoneNumber,
        Message: message,
      });

      const result = await this.snsClient.send(command);
      return result.MessageId || '';
    } catch (error) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  async publishToMultipleTopics(
    topicArns: string[],
    message: SNSMessage,
  ): Promise<{
    successful: string[];
    failed: { topicArn: string; error: string }[];
  }> {
    const successful: string[] = [];
    const failed: { topicArn: string; error: string }[] = [];

    for (const topicArn of topicArns) {
      try {
        const messageId = await this.publishMessage(topicArn, message);
        successful.push(messageId);
      } catch (error) {
        failed.push({ topicArn, error: error.message });
      }
    }

    return { successful, failed };
  }
}
