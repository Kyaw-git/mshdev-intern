import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Notifications (Mobile & Web)')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Retrieve all notifications for a specific user by ID' })
  async getMyNotifications(@Param('userId') userId: string) {
    const data = await this.notificationService.getUserNotifications(userId);
    return { success: true, data };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a specific notification as read by ID' })
  async readNotification(@Param('id') id: string) {
    const data = await this.notificationService.markAsRead(id);
    return { success: true, message: 'Notification marked as read', data };
  }

  @Patch('user/:userId/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read for a specific user' })
  async readAllNotifications(@Param('userId') userId: string) {
    await this.notificationService.markAllAsRead(userId);
    return { success: true, message: 'All notifications marked as read' };
  }
}