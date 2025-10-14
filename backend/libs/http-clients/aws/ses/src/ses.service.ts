import { Injectable } from '@nestjs/common';
import {
  SESClient,
  SendEmailCommand,
  SendRawEmailCommand,
  GetSendQuotaCommand,
} from '@aws-sdk/client-ses';

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

@Injectable()
export class SESService {
  private readonly sesClient: SESClient;

  constructor(private readonly region: string = 'us-east-1') {
    this.sesClient = new SESClient({ region: this.region });
  }

  async sendEmail(message: EmailMessage): Promise<string> {
    try {
      const command = new SendEmailCommand({
        Source: message.from,
        Destination: {
          ToAddresses: Array.isArray(message.to) ? message.to : [message.to],
          CcAddresses: message.cc
            ? Array.isArray(message.cc)
              ? message.cc
              : [message.cc]
            : undefined,
          BccAddresses: message.bcc
            ? Array.isArray(message.bcc)
              ? message.bcc
              : [message.bcc]
            : undefined,
        },
        Message: {
          Subject: {
            Data: message.subject,
            Charset: 'UTF-8',
          },
          Body: {
            Text: message.text
              ? {
                  Data: message.text,
                  Charset: 'UTF-8',
                }
              : undefined,
            Html: message.html
              ? {
                  Data: message.html,
                  Charset: 'UTF-8',
                }
              : undefined,
          },
        },
        ReplyToAddresses: message.replyTo ? [message.replyTo] : undefined,
      });

      const result = await this.sesClient.send(command);
      return result.MessageId || '';
    } catch (error) {
      throw new Error(`Failed to send email via SES: ${error.message}`);
    }
  }

  async sendRawEmail(message: RawEmailMessage): Promise<string> {
    try {
      const command = new SendRawEmailCommand({
        Source: message.from,
        Destinations: Array.isArray(message.to) ? message.to : [message.to],
        RawMessage: {
          Data: message.rawMessage,
        },
      });

      const result = await this.sesClient.send(command);
      return result.MessageId || '';
    } catch (error) {
      throw new Error(`Failed to send raw email via SES: ${error.message}`);
    }
  }

  async getSendQuota(): Promise<{
    max24HourSend: number;
    maxSendRate: number;
    sentLast24Hours: number;
  }> {
    try {
      const command = new GetSendQuotaCommand({});
      const result = await this.sesClient.send(command);

      return {
        max24HourSend: result.Max24HourSend || 0,
        maxSendRate: result.MaxSendRate || 0,
        sentLast24Hours: result.SentLast24Hours || 0,
      };
    } catch (error) {
      throw new Error(`Failed to get send quota: ${error.message}`);
    }
  }

  async sendTemplatedEmail(
    _templateName: string,
    _templateData: Record<string, any>,
    _message: Omit<EmailMessage, 'subject' | 'text' | 'html'>,
  ): Promise<string> {
    // This would require SES template functionality
    // For now, we'll throw an error indicating it needs to be implemented
    throw new Error('Templated email functionality not implemented yet');
  }

  async sendBulkEmail(messages: EmailMessage[]): Promise<{
    successful: string[];
    failed: { message: EmailMessage; error: string }[];
  }> {
    const successful: string[] = [];
    const failed: { message: EmailMessage; error: string }[] = [];

    for (const message of messages) {
      try {
        const messageId = await this.sendEmail(message);
        successful.push(messageId);
      } catch (error) {
        failed.push({ message, error: error.message });
      }
    }

    return { successful, failed };
  }
}
