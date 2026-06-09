import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../domain/repositories/order.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { OrderEntity } from '../domain/entities/order.entity';

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, items: { variant_id: string; quantity: number; price: number }[], totalAmount: number): Promise<OrderEntity> {
    const order = await this.prisma.order.create({
      data: {
        user_id: userId,
        total_amount: totalAmount,
        status: 'PENDING',
        order_lines: {
          create: items,
        },
      },
      include: { order_lines: true },
    });

    return this.mapToEntity(order);
  }

  async findAllAdmin(): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        order_lines: {
          include: { variant: { include: { product: true } } },
        },
      },
      orderBy: { created_at: 'desc' },
    });
    return orders.map(this.mapToEntity);
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { order_lines: true },
    });
    if (!order) return null;
    return this.mapToEntity(order);
  }

  async update(id: string, data: Partial<OrderEntity>): Promise<OrderEntity> {
    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        total_amount: data.total_amount,
      },
      include: { order_lines: true },
    });
    return this.mapToEntity(updated);
  }

  async updateItems(id: string, items: { id: string; quantity: number }[], totalAmount: number): Promise<OrderEntity> {
    return await this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.orderLine.update({
          where: { id: item.id },
          data: { quantity: item.quantity },
        });
      }
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { total_amount: totalAmount },
        include: { order_lines: true },
      });
      return this.mapToEntity(updatedOrder);
    });
  }

  private mapToEntity(prismaOrder: any): OrderEntity {
    return {
      id: prismaOrder.id,
      user_id: prismaOrder.user_id,
      total_amount: Number(prismaOrder.total_amount),
      status: prismaOrder.status,
      created_at: prismaOrder.created_at,
      updated_at: prismaOrder.updated_at,
      items: prismaOrder.order_lines ? prismaOrder.order_lines.map((line: any) => ({
        id: line.id,
        variant_id: line.variant_id,
        quantity: line.quantity,
        price: Number(line.price),
        product_name: line.variant?.product?.name,
      })) : [],
    };
  }
}