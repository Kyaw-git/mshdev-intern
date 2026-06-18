import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { NotificationService } from '../../../notification/notification.service';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(OrderRepository)
    private readonly orderRepository: OrderRepository,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.status === 'COMPLETED' || order.status === 'REJECTED') {
      throw new BadRequestException(`Cannot change status. Order is already ${order.status}`);
    }

    if (dto.status === 'REJECTED') {
      const orderLines = await this.prisma.orderLine.findMany({
        where: { order_id: orderId },
      });

      for (const line of orderLines) {
        await this.prisma.productVariant.update({
          where: { id: line.variant_id },
          data: {
            stock: { increment: line.quantity },
          },
        });
      }
    }

    const updatedOrder = await this.orderRepository.update(orderId, {
      status: dto.status,
    });

    let notiTitle = 'Order Update';
    let clientMessage = 'Your order has been received.';

    if (dto.status === 'APPROVED') {
      notiTitle = 'Order Approved! 🎉';
      clientMessage = `Your order #${orderId.slice(-6)} has been approved. The items will be shipped to your address shortly.`;
    } else if (dto.status === 'REJECTED') {
      notiTitle = 'Order Rejected';
      clientMessage = `We are sorry, your order #${orderId.slice(-6)} has been rejected due to insufficient stock or availability.`;
    } else if (dto.status === 'COMPLETED') {
      notiTitle = 'Order Completed!';
      clientMessage = `Your order #${orderId.slice(-6)} has been successfully completed. Thank you for shopping with us!`;
    }

    // 🎯 [ဘယ်လိုမှ မမှားနိုင်တော့မယ့် စိတ်ချရဆုံး Noti ပို့တဲ့အကွက်]
    try {
      // Domain Entity ရဲ့ အခေါ်အဝေါ် ကွဲလွဲမှုကို ကာကွယ်ဖို့ (order.user_id သို့မဟုတ် order.userId) တစ်ခုခုကနေ ဇွတ် ဆွဲထုတ်မယ်
      const targetUserId = (order as any).user_id || (order as any).userId;

      if (!targetUserId) {
        console.error(`[Notification Skipped]: Could not find user id in order object`);
      } else {
        await this.notificationService.createNotification(
          targetUserId,
          orderId,
          notiTitle,
          clientMessage,
        );
        console.log(`[Notification DB Saved]: For User ${targetUserId}`);
      }
    } catch (notiError: any) {
      console.error('⚠️ Failed to save notification to DB:', notiError.message);
    }

    return {
      message: 'Order status updated successfully',
      notification_text: clientMessage,
      order: updatedOrder,
    };
  }
}