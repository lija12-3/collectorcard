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
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = require("stripe");
let StripeService = class StripeService {
    constructor(config) {
        this.config = config;
        this.stripe = new stripe_1.default(this.config.secretKey, {
            apiVersion: '2023-10-16',
        });
    }
    async createCustomer(customerData) {
        try {
            const customer = await this.stripe.customers.create(customerData);
            return {
                id: customer.id,
                email: customer.email || '',
                name: customer.name || undefined,
                phone: customer.phone || undefined,
                address: customer.address || undefined,
            };
        }
        catch (error) {
            throw new Error(`Failed to create Stripe customer: ${error.message}`);
        }
    }
    async getCustomer(customerId) {
        try {
            const customer = await this.stripe.customers.retrieve(customerId);
            return {
                id: customer.id,
                email: customer.email || '',
                name: customer.name || undefined,
                phone: customer.phone || undefined,
                address: customer.address || undefined,
            };
        }
        catch (error) {
            throw new Error(`Failed to get Stripe customer: ${error.message}`);
        }
    }
    async createPaymentIntent(amount, currency, customerId, metadata) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency,
                customer: customerId,
                metadata,
            });
            return {
                id: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                clientSecret: paymentIntent.client_secret || '',
            };
        }
        catch (error) {
            throw new Error(`Failed to create payment intent: ${error.message}`);
        }
    }
    async confirmPaymentIntent(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
            return {
                id: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                clientSecret: paymentIntent.client_secret || '',
            };
        }
        catch (error) {
            throw new Error(`Failed to confirm payment intent: ${error.message}`);
        }
    }
    async createSubscription(customerId, priceId, metadata) {
        try {
            return await this.stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: priceId }],
                metadata,
            });
        }
        catch (error) {
            throw new Error(`Failed to create subscription: ${error.message}`);
        }
    }
    async cancelSubscription(subscriptionId) {
        try {
            return await this.stripe.subscriptions.cancel(subscriptionId);
        }
        catch (error) {
            throw new Error(`Failed to cancel subscription: ${error.message}`);
        }
    }
    async constructWebhookEvent(payload, signature) {
        try {
            return this.stripe.webhooks.constructEvent(payload, signature, this.config.webhookSecret);
        }
        catch (error) {
            throw new Error(`Failed to construct webhook event: ${error.message}`);
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], StripeService);
//# sourceMappingURL=stripe.service.js.map