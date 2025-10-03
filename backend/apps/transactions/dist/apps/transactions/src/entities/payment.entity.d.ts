export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum PaymentMethod {
    CARD = "card",
    BANK_TRANSFER = "bank_transfer",
    DIGITAL_WALLET = "digital_wallet",
    CRYPTOCURRENCY = "cryptocurrency"
}
export declare class Payment {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    externalPaymentId?: string;
    description?: string;
    metadata?: Record<string, any>;
    paymentDetails?: {
        cardLast4?: string;
        cardBrand?: string;
        bankName?: string;
        walletType?: string;
    };
    failureReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
