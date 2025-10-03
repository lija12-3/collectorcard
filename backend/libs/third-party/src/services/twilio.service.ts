import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

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

@Injectable()
export class TwilioService {
  private readonly client: twilio.Twilio;

  constructor(private readonly config: TwilioConfig) {
    this.client = twilio(this.config.accountSid, this.config.authToken);
  }

  async sendSMS(to: string, body: string): Promise<TwilioMessage> {
    try {
      const message = await this.client.messages.create({
        body,
        from: this.config.phoneNumber,
        to,
      });

      return {
        sid: message.sid,
        to: message.to,
        from: message.from,
        body: message.body,
        status: message.status,
        dateCreated: message.dateCreated,
      };
    } catch (error) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  async sendWhatsApp(to: string, body: string): Promise<TwilioMessage> {
    try {
      const message = await this.client.messages.create({
        body,
        from: `whatsapp:${this.config.phoneNumber}`,
        to: `whatsapp:${to}`,
      });

      return {
        sid: message.sid,
        to: message.to,
        from: message.from,
        body: message.body,
        status: message.status,
        dateCreated: message.dateCreated,
      };
    } catch (error) {
      throw new Error(`Failed to send WhatsApp message: ${error.message}`);
    }
  }

  async makeCall(to: string, url: string): Promise<string> {
    try {
      const call = await this.client.calls.create({
        to,
        from: this.config.phoneNumber,
        url,
      });

      return call.sid;
    } catch (error) {
      throw new Error(`Failed to make call: ${error.message}`);
    }
  }

  async getMessage(messageSid: string): Promise<TwilioMessage> {
    try {
      const message = await this.client.messages(messageSid).fetch();

      return {
        sid: message.sid,
        to: message.to,
        from: message.from,
        body: message.body,
        status: message.status,
        dateCreated: message.dateCreated,
      };
    } catch (error) {
      throw new Error(`Failed to get message: ${error.message}`);
    }
  }

  async sendBulkSMS(recipients: string[], body: string): Promise<{
    successful: TwilioMessage[];
    failed: { recipient: string; error: string }[];
  }> {
    const successful: TwilioMessage[] = [];
    const failed: { recipient: string; error: string }[] = [];

    for (const recipient of recipients) {
      try {
        const message = await this.sendSMS(recipient, body);
        successful.push(message);
      } catch (error) {
        failed.push({ recipient, error: error.message });
      }
    }

    return { successful, failed };
  }
}
