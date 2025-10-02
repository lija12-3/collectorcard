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
exports.SESService = void 0;
const common_1 = require("@nestjs/common");
const client_ses_1 = require("@aws-sdk/client-ses");
let SESService = class SESService {
    constructor(region = 'us-east-1') {
        this.region = region;
        this.sesClient = new client_ses_1.SESClient({ region: this.region });
    }
    async sendEmail(message) {
        try {
            const command = new client_ses_1.SendEmailCommand({
                Source: message.from,
                Destination: {
                    ToAddresses: Array.isArray(message.to) ? message.to : [message.to],
                    CcAddresses: message.cc ? (Array.isArray(message.cc) ? message.cc : [message.cc]) : undefined,
                    BccAddresses: message.bcc ? (Array.isArray(message.bcc) ? message.bcc : [message.bcc]) : undefined,
                },
                Message: {
                    Subject: {
                        Data: message.subject,
                        Charset: 'UTF-8',
                    },
                    Body: {
                        Text: message.text ? {
                            Data: message.text,
                            Charset: 'UTF-8',
                        } : undefined,
                        Html: message.html ? {
                            Data: message.html,
                            Charset: 'UTF-8',
                        } : undefined,
                    },
                },
                ReplyToAddresses: message.replyTo ? [message.replyTo] : undefined,
            });
            const result = await this.sesClient.send(command);
            return result.MessageId || '';
        }
        catch (error) {
            throw new Error(`Failed to send email via SES: ${error.message}`);
        }
    }
    async sendRawEmail(message) {
        try {
            const command = new client_ses_1.SendRawEmailCommand({
                Source: message.from,
                Destinations: Array.isArray(message.to) ? message.to : [message.to],
                RawMessage: {
                    Data: message.rawMessage,
                },
            });
            const result = await this.sesClient.send(command);
            return result.MessageId || '';
        }
        catch (error) {
            throw new Error(`Failed to send raw email via SES: ${error.message}`);
        }
    }
    async getSendQuota() {
        try {
            const command = new client_ses_1.GetSendQuotaCommand({});
            const result = await this.sesClient.send(command);
            return {
                max24HourSend: result.Max24HourSend || 0,
                maxSendRate: result.MaxSendRate || 0,
                sentLast24Hours: result.SentLast24Hours || 0,
            };
        }
        catch (error) {
            throw new Error(`Failed to get send quota: ${error.message}`);
        }
    }
    async sendTemplatedEmail(templateName, templateData, message) {
        throw new Error('Templated email functionality not implemented yet');
    }
    async sendBulkEmail(messages) {
        const successful = [];
        const failed = [];
        for (const message of messages) {
            try {
                const messageId = await this.sendEmail(message);
                successful.push(messageId);
            }
            catch (error) {
                failed.push({ message, error: error.message });
            }
        }
        return { successful, failed };
    }
};
exports.SESService = SESService;
exports.SESService = SESService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], SESService);
//# sourceMappingURL=ses.service.js.map