import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private notiGateway: NotificationGateway,
  ) {}


  async createNotification(title: string, message: string) {

    const noti = await this.prisma.notification.create({
      data: { title, message },
    });

    this.notiGateway.sendNotification(noti);

    return noti;
  }

  async getNotifications() {
    return this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}