import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { StripeService } from '@shared/utils';
import { CardinalLoggerService } from '@shared/logger';
import { SQSService } from '@shared/aws';
export declare class PaymentService {
    private readonly paymentRepository;
    private readonly stripeService;
    private readonly logger;
    private readonly sqsService;
    constructor(paymentRepository: Repository<Payment>, stripeService: StripeService, logger: CardinalLoggerService, sqsService: SQSService);
    createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment>;
    findAll(): Promise<Payment[]>;
    findOne(id: string): Promise<Payment>;
    findByUserId(userId: string): Promise<Payment[]>;
    updateStatus(id: string, status: PaymentStatus, failureReason?: string): Promise<Payment>;
    private processPayment;
    private processCardPayment;
    private processBankTransfer;
    private processDigitalWallet;
    private sendPaymentNotification;
}
