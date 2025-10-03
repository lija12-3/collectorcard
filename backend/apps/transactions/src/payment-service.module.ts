import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { AuthModule } from '@shared/auth';
import { DatabaseModule } from '@shared/database';
import { LoggerModule, LogLevel } from '@shared/logger';
import { SQSModule } from '@shared/aws';
import { ThirdPartyModule } from '@shared/utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Payment]),
    AuthModule.forRoot({
      config: {
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
        encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key-32-chars-long',
      },
    }),
    LoggerModule.forRoot({
      level: LogLevel.INFO,
      service: 'payment-service',
      enableConsole: true,
      enableFile: true,
      filePath: './logs/payment-service.log',
    }),
    SQSModule.forRoot(process.env.AWS_REGION || 'us-east-1'),
    ThirdPartyModule.forRoot({
      stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        environment: process.env.NODE_ENV === 'production' ? 'live' : 'test',
      },
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentServiceModule {}
