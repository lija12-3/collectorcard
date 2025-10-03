import { PaymentMethod } from '../entities/payment.entity';
export declare class CreatePaymentDto {
    userId: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    description?: string;
    metadata?: Record<string, any>;
    paymentDetails?: {
        cardLast4?: string;
        cardBrand?: string;
        bankName?: string;
        walletType?: string;
    };
}
