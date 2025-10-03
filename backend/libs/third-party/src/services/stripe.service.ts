import { Injectable } from '@nestjs/common';
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

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly config: StripeConfig) {
    this.stripe = new Stripe(this.config.secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createCustomer(customerData: {
    email: string;
    name?: string;
    phone?: string;
    address?: Stripe.Address;
  }): Promise<StripeCustomer> {
    try {
      const customer = await this.stripe.customers.create(customerData);
      return {
        id: customer.id,
        email: customer.email || '',
        name: customer.name || undefined,
        phone: customer.phone || undefined,
        address: customer.address || undefined,
      };
    } catch (error) {
      throw new Error(`Failed to create Stripe customer: ${error.message}`);
    }
  }

  async getCustomer(customerId: string): Promise<StripeCustomer> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId) as Stripe.Customer;
      return {
        id: customer.id,
        email: customer.email || '',
        name: customer.name || undefined,
        phone: customer.phone || undefined,
        address: customer.address || undefined,
      };
    } catch (error) {
      throw new Error(`Failed to get Stripe customer: ${error.message}`);
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    customerId?: string,
    metadata?: Record<string, string>,
  ): Promise<StripePaymentIntent> {
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
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  async confirmPaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret || '',
      };
    } catch (error) {
      throw new Error(`Failed to confirm payment intent: ${error.message}`);
    }
  }

  async createSubscription(
    customerId: string,
    priceId: string,
    metadata?: Record<string, string>,
  ): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata,
      });
    } catch (error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.cancel(subscriptionId);
    } catch (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  async constructWebhookEvent(payload: string, signature: string): Promise<Stripe.Event> {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, this.config.webhookSecret);
    } catch (error) {
      throw new Error(`Failed to construct webhook event: ${error.message}`);
    }
  }
}
