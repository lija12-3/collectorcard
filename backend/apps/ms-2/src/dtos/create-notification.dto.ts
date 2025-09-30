import { IsEnum, IsString, IsOptional, IsObject, IsNotEmpty } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  recipient?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
