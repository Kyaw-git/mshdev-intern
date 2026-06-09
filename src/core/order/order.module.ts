import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { OrderController } from './presentation/order.controller';
import { CreateOrderUseCase } from './application/use-case/create-order.usecase';
import { GetAdminOrdersUseCase } from './application/use-case/get-admin-orders.usecase';
import { UpdateOrderItemsUseCase } from './application/use-case/update-order-items.usecase';
import { OrderRepository } from './domain/repositories/order.repository';
import { PrismaOrderRepository } from './infrastructure/prisma-order.repository';
import { UpdateOrderStatusUseCase } from './application/use-case/update-order-status.usecase';
import { GetMyOrdersUseCase } from './application/use-case/get-myorder.usecase';

@Module({
  imports: [PrismaModule], 
  controllers: [OrderController],
  providers: [
    
    CreateOrderUseCase,
    GetAdminOrdersUseCase,
    UpdateOrderItemsUseCase,
    UpdateOrderStatusUseCase,
    GetMyOrdersUseCase,
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
  ],
  exports: [
    CreateOrderUseCase,
    GetAdminOrdersUseCase,
    UpdateOrderItemsUseCase,
  ],
})
export class OrderModule {}