import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateOrderDto } from '../dtos/create-order.dto';

@Injectable()
export class CreateOrderUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Cart is empty. Cannot create order.');
    }

    return await this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderLinesData = [];

      for (const item of dto.items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variant_id },
          include: { product: true },
        });

        if (!variant) {
          throw new NotFoundException(`Product variant with ID ${item.variant_id} not found`);
        }

        if (variant.stock < item.quantity) {
          throw new BadRequestException(`In-sufficient stock for product: ${variant.product.name} (${variant.color})`);
        }

        const itemPrice = Number(variant.product.price);
        const lineTotal = itemPrice * item.quantity;
        totalAmount += lineTotal;

        orderLinesData.push({
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: itemPrice,
        });

        await tx.productVariant.update({
          where: { id: item.variant_id },
          data: { stock: variant.stock - item.quantity },
        });
      }

      const order = await tx.order.create({
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

      return {
        message: 'Order placed successfully',
        order,
      };
    });
  }
}