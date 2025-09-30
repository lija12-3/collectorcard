import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { PaymentStatus } from '../entities/payment.entity';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    create(createPaymentDto: CreatePaymentDto): Promise<import("../entities/payment.entity").Payment>;
    findAll(): Promise<import("../entities/payment.entity").Payment[]>;
    findMyPayments(req: any): Promise<import("../entities/payment.entity").Payment[]>;
    findOne(id: string): Promise<import("../entities/payment.entity").Payment>;
    updateStatus(id: string, body: {
        status: PaymentStatus;
        failureReason?: string;
    }): Promise<import("../entities/payment.entity").Payment>;
}
