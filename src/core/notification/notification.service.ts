import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}


  async createNotification(userId: string, orderId: string | null, title: string, message: string) {
    return await this.prisma.notification.create({
      data: {
        user_id: userId,
        order_id: orderId,
        title: title,
        message: message,
      },
    });
  }

  async getUserNotifications(userId: string) {
    return await this.prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }, 
    });
  }

  
  async markAsRead(notificationId: string) {
    const noti = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!noti) throw new NotFoundException('Notification not found');

    return await this.prisma.notification.update({
      where: { id: notificationId },
      data: { is_read: true },
    });
  }

  
  async markAllAsRead(userId: string) {
    return await this.prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });
  }
}