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
exports.TwilioService = void 0;
const common_1 = require("@nestjs/common");
const twilio = require("twilio");
let TwilioService = class TwilioService {
    constructor(config) {
        this.config = config;
        this.client = twilio(this.config.accountSid, this.config.authToken);
    }
    async sendSMS(to, body) {
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
        }
        catch (error) {
            throw new Error(`Failed to send SMS: ${error.message}`);
        }
    }
    async sendWhatsApp(to, body) {
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
        }
        catch (error) {
            throw new Error(`Failed to send WhatsApp message: ${error.message}`);
        }
    }
    async makeCall(to, url) {
        try {
            const call = await this.client.calls.create({
                to,
                from: this.config.phoneNumber,
                url,
            });
            return call.sid;
        }
        catch (error) {
            throw new Error(`Failed to make call: ${error.message}`);
        }
    }
    async getMessage(messageSid) {
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
        }
        catch (error) {
            throw new Error(`Failed to get message: ${error.message}`);
        }
    }
    async sendBulkSMS(recipients, body) {
        const successful = [];
        const failed = [];
        for (const recipient of recipients) {
            try {
                const message = await this.sendSMS(recipient, body);
                successful.push(message);
            }
            catch (error) {
                failed.push({ recipient, error: error.message });
            }
        }
        return { successful, failed };
    }
};
exports.TwilioService = TwilioService;
exports.TwilioService = TwilioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], TwilioService);
//# sourceMappingURL=twilio.service.js.map