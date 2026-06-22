// import { Injectable, Inject, NotFoundException } from '@nestjs/common';
// import { OrderRepository } from '../../domain/repositories/order.repository';
// import { UpdateOrderItemsDto } from '../dtos/update-order-items.dto';
// import { PrismaService } from '../../../../prisma/prisma.service'; // 💡 ဈေးနှုန်းတွေ လှမ်းစစ်ဖို့

// @Injectable()
// export class UpdateOrderItemsUseCase {
//   constructor(
//     @Inject(OrderRepository)
//     private readonly orderRepository: OrderRepository,
//     private readonly prisma: PrismaService,
//   ) {}

//   async execute(orderId: string, dto: UpdateOrderItemsDto) {
//     const order = await this.orderRepository.findById(orderId);
//     if (!order) {
//       throw new NotFoundException(`Order with ID ${orderId} not found`);
//     }

//     let newTotalAmount = 0;
//     const itemsToUpdate = [];

//     const currentLines = await this.prisma.orderLine.findMany({
//       where: { order_id: orderId },
//     });

//     for (const line of currentLines) {
//       const updateItem = dto.items.find(item => item.order_line_id === line.id);

//       const finalQuantity = updateItem ? updateItem.quantity : line.quantity;
//       const itemPrice = Number(line.price);

//       newTotalAmount += finalQuantity * itemPrice;

//       if (updateItem) {
//         itemsToUpdate.push({
//           id: line.id,
//           quantity: updateItem.quantity,
//         });
//       }
//     }

//     const updatedOrder = await this.orderRepository.updateItems(
//       orderId,
//       itemsToUpdate,
//       newTotalAmount,
//     );

//     return {
//       message: 'Order items updated and total amount re-calculated successfully',
//       order: updatedOrder,
//     };
//   }
// }

import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { UpdateOrderItemsDto } from '../dtos/update-order-items.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { NotificationService } from '../../../notification/notification.service';

@Injectable()
export class UpdateOrderItemsUseCase {
  constructor(
    @Inject(OrderRepository)
    private readonly orderRepository: OrderRepository,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(orderId: string, dto: UpdateOrderItemsDto) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.status === 'COMPLETED' || order.status === 'REJECTED') {
      throw new BadRequestException(
        `Cannot update items. Order is already ${order.status}`,
      );
    }

    let newTotalAmount = 0;
    const itemsToUpdate = [];

    const currentLines = await this.prisma.orderLine.findMany({
      where: { order_id: orderId },
    });

    for (const line of currentLines) {
      const updateItem = dto.items.find(
        (item) => item.order_line_id === line.id,
      );

      const finalQuantity = updateItem ? updateItem.quantity : line.quantity;
      const itemPrice = Number(line.price);

      newTotalAmount += finalQuantity * itemPrice;

      if (updateItem) {
        const quantityDiff = updateItem.quantity - line.quantity;

        if (quantityDiff !== 0) {
          const variant = await this.prisma.productVariant.findUnique({
            where: { id: line.variant_id },
          });

          if (quantityDiff > 0 && variant && variant.stock < quantityDiff) {
            throw new BadRequestException(
              `Insufficient stock for variant ID: ${line.variant_id}. Available: ${variant.stock}`,
            );
          }

          await this.prisma.productVariant.update({
            where: { id: line.variant_id },
            data: {
              stock: { decrement: quantityDiff },
            },
          });
        }

        itemsToUpdate.push({
          id: line.id,
          quantity: updateItem.quantity,
        });
      }
    }

    const updatedOrder = await this.orderRepository.updateItems(
      orderId,
      itemsToUpdate,
      newTotalAmount,
    );

    const clientMessage = `Admin has updated the items in your order #${orderId.slice(-6)}. Total amount has been re-calculated to $${newTotalAmount.toFixed(2)}.`;

    try {
      const targetUserId = (order as any).user_id || (order as any).userId;

      if (targetUserId) {
        await this.notificationService.createNotification(
          targetUserId,
          orderId,
          '🛒 Order Items Updated!',
          clientMessage,
        );
        console.log(
          `[Notification Saved]: Order items update noti sent to User ${targetUserId}`,
        );
      }
    } catch (notiError: any) {
      console.error(
        '⚠️ Failed to send order items update notification:',
        notiError.message,
      );
    }

    return {
      message:
        'Order items updated and total amount re-calculated successfully',
      notification_text: clientMessage,
      order: updatedOrder,
    };
  }
}
