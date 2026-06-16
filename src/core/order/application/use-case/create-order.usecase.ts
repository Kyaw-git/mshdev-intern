import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { NotificationService } from '../../../notification/notification.service';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(userId: string, dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Cart is empty. Cannot create order.');
    }

    let totalAmount = 0;
    const orderLinesData = [];
    const stockUpdates = [];

    for (const item of dto.items) {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: item.variant_id },
        include: { product: true },
      });

      if (!variant) {
        throw new NotFoundException(
          `Product variant with ID ${item.variant_id} not found`,
        );
      }

      if (variant.stock < item.quantity) {
        throw new BadRequestException(
          `In-sufficient stock for product: ${variant.product.name} (${variant.color})`,
        );
      }

      const itemPrice = Number(variant.product.price);
      const lineTotal = itemPrice * item.quantity;
      totalAmount += lineTotal;

      orderLinesData.push({
        variant_id: item.variant_id,
        quantity: item.quantity,
        price: itemPrice,
      });

      stockUpdates.push({
        id: item.variant_id,
        newStock: variant.stock - item.quantity,
      });
    }

    for (const update of stockUpdates) {
      await this.prisma.productVariant.update({
        where: { id: update.id },
        data: { stock: update.newStock },
      });
    }

    const order = await this.prisma.order.create({
      data: {
        user_id: userId,
        total_amount: totalAmount,
        status: 'PENDING',
        order_lines: {
          create: orderLinesData,
        },
      },
      include: {
        order_lines: true,
      },
    });
    try {
      await this.notificationService.createNotification(
        userId,
        order.id,
        '🛒 Order Placed Successfully!',
        `Your order #${order.id.slice(-6).toUpperCase()} has been placed. Total amount is $${totalAmount}. Waiting for admin approval.`,
      );
    } catch (notiError: any) {
      console.error('Notification trigger failed:', notiError.message);
    }

    return {
      message: 'Order placed successfully',
      order,
    };
  }
}
