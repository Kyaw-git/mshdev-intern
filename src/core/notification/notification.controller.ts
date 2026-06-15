import { Controller, Get, Patch, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notiService: NotificationService) {}

  @Get()
  getAll() {
    return this.notiService.getNotifications();
  }

  @Patch(':id/read')
  readNotification(@Param('id') id: string) {
    return this.notiService.markAsRead(id);
  }
}