import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { AccessTokenGuard } from '@cardinal/auth';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  findAll() {
    return this.notificationService.findAll();
  }

  @Get('my-notifications')
  @UseGuards(AccessTokenGuard)
  findMyNotifications(@Request() req) {
    return this.notificationService.findByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id/read')
  @UseGuards(AccessTokenGuard)
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }
}
