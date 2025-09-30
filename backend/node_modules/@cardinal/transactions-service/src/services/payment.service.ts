import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { StripeService } from '@shared/utils';
import { CardinalLoggerService } from '@shared/logger';
import { SQSService } from '@shared/aws';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly stripeService: StripeService,
    private readonly logger: CardinalLoggerService,
    private readonly sqsService: SQSService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      // Create payment record
      const payment = this.paymentRepository.create({
        ...createPaymentDto,
        status: PaymentStatus.PENDING,
      });

      const savedPayment = await this.paymentRepository.save(payment);

      // Process payment based on method
      await this.processPayment(savedPayment);

      this.logger.log(`Payment created: ${savedPayment.id}`, {
        service: 'payment-service',
        paymentId: savedPayment.id,
        userId: savedPayment.userId,
        amount: savedPayment.amount,
      });

      return savedPayment;
    } catch (error) {
      this.logger.error(`Failed to create payment: ${error.message}`, error.stack, {
        service: 'payment-service',
        userId: createPaymentDto.userId,
      });
      throw error;
    }
  }

  async findAll(): Promise<Payment[]> {
    try {
      return await this.paymentRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`Failed to find all payments: ${error.message}`, error.stack, {
        service: 'payment-service',
      });
      throw error;
    }
  }

  async findOne(id: string): Promise<Payment> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id },
      });

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      return payment;
    } catch (error) {
      this.logger.error(`Failed to find payment: ${error.message}`, error.stack, {
        service: 'payment-service',
        paymentId: id,
      });
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    try {
      return await this.paymentRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`Failed to find payments by user: ${error.message}`, error.stack, {
        service: 'payment-service',
        userId,
      });
      throw error;
    }
  }

  async updateStatus(id: string, status: PaymentStatus, failureReason?: string): Promise<Payment> {
    try {
      const payment = await this.findOne(id);
      
      payment.status = status;
      if (failureReason) {
        payment.failureReason = failureReason;
      }

      const updatedPayment = await this.paymentRepository.save(payment);

      // Send notification via SQS
      await this.sendPaymentNotification(updatedPayment);

      this.logger.log(`Payment status updated: ${id} to ${status}`, {
        service: 'payment-service',
        paymentId: id,
        status,
      });

      return updatedPayment;
    } catch (error) {
      this.logger.error(`Failed to update payment status: ${error.message}`, error.stack, {
        service: 'payment-service',
        paymentId: id,
      });
      throw error;
    }
  }

  private async processPayment(payment: Payment): Promise<void> {
    try {
      // Update status to processing
      payment.status = PaymentStatus.PROCESSING;
      await this.paymentRepository.save(payment);

      // Process based on payment method
      switch (payment.paymentMethod) {
        case 'card':
          await this.processCardPayment(payment);
          break;
        case 'bank_transfer':
          await this.processBankTransfer(payment);
          break;
        case 'digital_wallet':
          await this.processDigitalWallet(payment);
          break;
        default:
          throw new Error(`Unsupported payment method: ${payment.paymentMethod}`);
      }
    } catch (error) {
      // Update payment status to failed
      await this.updateStatus(payment.id, PaymentStatus.FAILED, error.message);
      throw error;
    }
  }

  private async processCardPayment(payment: Payment): Promise<void> {
    try {
      // Create Stripe payment intent
      const paymentIntent = await this.stripeService.createPaymentIntent(
        Math.round(payment.amount * 100), // Convert to cents
        payment.currency,
        payment.userId,
        {
          paymentId: payment.id,
          description: payment.description,
        },
      );

      payment.externalPaymentId = paymentIntent.id;
      payment.status = PaymentStatus.COMPLETED;
      await this.paymentRepository.save(payment);

      this.logger.log(`Card payment processed: ${payment.id}`, {
        service: 'payment-service',
        paymentId: payment.id,
        stripePaymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      this.logger.error(`Failed to process card payment: ${error.message}`, error.stack, {
        service: 'payment-service',
        paymentId: payment.id,
      });
      throw error;
    }
  }

  private async processBankTransfer(payment: Payment): Promise<void> {
    // Implement bank transfer logic
    // This would typically involve creating a bank transfer request
    // and waiting for confirmation
    payment.status = PaymentStatus.PROCESSING;
    await this.paymentRepository.save(payment);

    this.logger.log(`Bank transfer initiated: ${payment.id}`, {
      service: 'payment-service',
      paymentId: payment.id,
    });
  }

  private async processDigitalWallet(payment: Payment): Promise<void> {
    // Implement digital wallet logic
    // This would involve integrating with services like PayPal, Apple Pay, etc.
    payment.status = PaymentStatus.PROCESSING;
    await this.paymentRepository.save(payment);

    this.logger.log(`Digital wallet payment initiated: ${payment.id}`, {
      service: 'payment-service',
      paymentId: payment.id,
    });
  }

  private async sendPaymentNotification(payment: Payment): Promise<void> {
    try {
      const queueUrl = process.env.PAYMENT_NOTIFICATION_QUEUE_URL;
      if (!queueUrl) {
        this.logger.warn('Payment notification queue URL not configured', {
          service: 'payment-service',
        });
        return;
      }

      const message = {
        type: 'payment_status_update',
        paymentId: payment.id,
        userId: payment.userId,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        timestamp: new Date().toISOString(),
      };

      await this.sqsService.sendMessage(queueUrl, JSON.stringify(message));

      this.logger.log(`Payment notification sent: ${payment.id}`, {
        service: 'payment-service',
        paymentId: payment.id,
        status: payment.status,
      });
    } catch (error) {
      this.logger.error(`Failed to send payment notification: ${error.message}`, error.stack, {
        service: 'payment-service',
        paymentId: payment.id,
      });
    }
  }
}
