import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { AccessTokenGuard } from '@shared/auth';
import { PaymentStatus } from '../entities/payment.entity';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('my-payments')
  @UseGuards(AccessTokenGuard)
  findMyPayments(@Request() req) {
    return this.paymentService.findByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Post(':id/status')
  @UseGuards(AccessTokenGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: PaymentStatus; failureReason?: string },
  ) {
    return this.paymentService.updateStatus(id, body.status, body.failureReason);
  }
}
