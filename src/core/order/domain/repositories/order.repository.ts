import { OrderEntity } from '../entities/order.entity';

export interface OrderRepository {
  create(userId: string, items: { variant_id: string; quantity: number; price: number }[], totalAmount: number): Promise<OrderEntity>;
  findAllAdmin(): Promise<OrderEntity[]>;
  findById(id: string): Promise<OrderEntity | null>;
  update(id: string, data: Partial<OrderEntity>): Promise<OrderEntity>;
  updateItems(id: string, items: { id: string; quantity: number }[], totalAmount: number): Promise<OrderEntity>;
}

export const OrderRepository = Symbol('OrderRepository');