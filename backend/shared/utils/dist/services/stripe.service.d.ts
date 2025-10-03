import Stripe from 'stripe';
export interface StripeConfig {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
    environment: 'test' | 'live';
}
export interface StripeCustomer {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    address?: Stripe.Address;
}
export interface StripePaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: string;
    clientSecret: string;
}
export declare class StripeService {
    private readonly config;
    private readonly stripe;
    constructor(config: StripeConfig);
    createCustomer(customerData: {
        email: string;
        name?: string;
        phone?: string;
        address?: Stripe.Address;
    }): Promise<StripeCustomer>;
    getCustomer(customerId: string): Promise<StripeCustomer>;
    createPaymentIntent(amount: number, currency: string, customerId?: string, metadata?: Record<string, string>): Promise<StripePaymentIntent>;
    confirmPaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent>;
    createSubscription(customerId: string, priceId: string, metadata?: Record<string, string>): Promise<Stripe.Subscription>;
    cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription>;
    constructWebhookEvent(payload: string, signature: string): Promise<Stripe.Event>;
}
