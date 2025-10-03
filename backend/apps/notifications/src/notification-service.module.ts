import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { AuthModule } from '@shared/auth';
import { DatabaseModule } from '@shared/database';
import { LoggerModule, LogLevel } from '@shared/logger';
import { SESModule, SNSModule, SQSModule } from '@shared/aws';
import { ThirdPartyModule } from '@shared/utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Notification]),
    AuthModule.forRoot({
      config: {
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
        encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key-32-chars-long',
      },
    }),
    LoggerModule.forRoot({
      level: LogLevel.INFO,
      service: 'notification-service',
      enableConsole: true,
      enableFile: true,
      filePath: './logs/notification-service.log',
    }),
    SESModule.forRoot(process.env.AWS_REGION || 'us-east-1'),
    SNSModule.forRoot(process.env.AWS_REGION || 'us-east-1'),
    SQSModule.forRoot(process.env.AWS_REGION || 'us-east-1'),
    ThirdPartyModule.forRoot({
      twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER,
        environment: process.env.NODE_ENV === 'production' ? 'live' : 'test',
      },
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationServiceModule {}
