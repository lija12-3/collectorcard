import { Injectable } from '@nestjs/common';
import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  GetQueueUrlCommand,
} from '@aws-sdk/client-sqs';

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

@Injectable()
export class SQSService {
  private readonly sqsClient: SQSClient;

  constructor(private readonly region: string = 'us-east-1') {
    this.sqsClient = new SQSClient({ region: this.region });
  }

  async sendMessage(
    queueUrl: string,
    messageBody: string,
    options?: SQSSendMessageOptions,
  ): Promise<string> {
    try {
      const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: messageBody,
        DelaySeconds: options?.delaySeconds,
        MessageAttributes: options?.messageAttributes,
        MessageGroupId: options?.messageGroupId,
        MessageDeduplicationId: options?.messageDeduplicationId,
      });

      const result = await this.sqsClient.send(command);
      return result.MessageId || '';
    } catch (error) {
      throw new Error(`Failed to send message to SQS: ${error.message}`);
    }
  }

  async receiveMessages(
    queueUrl: string,
    maxMessages: number = 10,
    waitTimeSeconds: number = 0,
  ): Promise<SQSMessage[]> {
    try {
      const command = new ReceiveMessageCommand({
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
    } catch (error) {
      throw new Error(`Failed to receive messages from SQS: ${error.message}`);
    }
  }

  async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      });

      await this.sqsClient.send(command);
    } catch (error) {
      throw new Error(`Failed to delete message from SQS: ${error.message}`);
    }
  }

  async getQueueUrl(queueName: string): Promise<string> {
    try {
      const command = new GetQueueUrlCommand({
        QueueName: queueName,
      });

      const result = await this.sqsClient.send(command);
      return result.QueueUrl || '';
    } catch (error) {
      throw new Error(`Failed to get queue URL: ${error.message}`);
    }
  }

  async sendBatchMessages(
    queueUrl: string,
    messages: Array<{
      id: string;
      body: string;
      messageAttributes?: Record<string, any>;
    }>,
  ): Promise<{ successful: string[]; failed: string[] }> {
    const successful: string[] = [];
    const failed: string[] = [];

    for (const message of messages) {
      try {
        const messageId = await this.sendMessage(queueUrl, message.body, {
          messageAttributes: message.messageAttributes,
        });
        successful.push(messageId);
      } catch (error) {
        failed.push(message.id);
      }
    }

    return { successful, failed };
  }
}
