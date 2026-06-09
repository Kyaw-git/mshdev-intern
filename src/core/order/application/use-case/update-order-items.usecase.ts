import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { UpdateOrderItemsDto } from '../dtos/update-order-items.dto';
import { PrismaService } from '../../../../prisma/prisma.service'; // 💡 ဈေးနှုန်းတွေ လှမ်းစစ်ဖို့

@Injectable()
export class UpdateOrderItemsUseCase {
  constructor(
    @Inject(OrderRepository)
    private readonly orderRepository: OrderRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(orderId: string, dto: UpdateOrderItemsDto) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    let newTotalAmount = 0;
    const itemsToUpdate = [];

    const currentLines = await this.prisma.orderLine.findMany({
      where: { order_id: orderId },
    });

    for (const line of currentLines) {
      const updateItem = dto.items.find(item => item.order_line_id === line.id);
      
      const finalQuantity = updateItem ? updateItem.quantity : line.quantity;
      const itemPrice = Number(line.price);

      newTotalAmount += finalQuantity * itemPrice;

      if (updateItem) {
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

    return {
      message: 'Order items updated and total amount re-calculated successfully',
      order: updatedOrder,
    };
  }
}