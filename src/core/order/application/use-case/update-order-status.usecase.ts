import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(OrderRepository)
    private readonly orderRepository: OrderRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(orderId: string, dto: UpdateOrderStatusDto) {
    // 1. Check if order exists
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Prevent modification if order is already COMPLETED or REJECTED
    if (order.status === 'COMPLETED' || order.status === 'REJECTED') {
      throw new BadRequestException(`Cannot change status. Order is already ${order.status}`);
    }

    // 2. Rollback stock if order is REJECTED
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

    // 3. Update order status via repository
    const updatedOrder = await this.orderRepository.update(orderId, {
      status: dto.status,
    });

    // 4. Format notification message for mobile client
    let clientMessage = 'Your order has been received.';
    if (dto.status === 'APPROVED') {
      clientMessage = 'Your order has been approved. The items will be shipped shortly.';
    } else if (dto.status === 'REJECTED') {
      clientMessage = 'We are sorry, your order has been rejected due to insufficient stock.';
    } else if (dto.status === 'COMPLETED') {
      clientMessage = 'Your order has been successfully completed. Thank you for shopping with us!';
    }

    return {
      message: 'Order status updated successfully',
      notification_text: clientMessage,
      order: updatedOrder,
    };
  }
}