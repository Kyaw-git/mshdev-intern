
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { CreateOrderUseCase } from '../application/use-case/create-order.usecase';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from '../application/dtos/create-order.dto';
import { GetAdminOrdersUseCase } from '../application/use-case/get-admin-orders.usecase';
import { UpdateOrderItemsDto } from '../application/dtos/update-order-items.dto';
import { UpdateOrderItemsUseCase } from '../application/use-case/update-order-items.usecase';
import { UpdateOrderStatusUseCase } from '../application/use-case/update-order-status.usecase';
import { UpdateOrderStatusDto } from '../application/dtos/update-order-status.dto';
import { GetMyOrdersUseCase } from '../application/use-case/get-myorder.usecase';
import { CurrentUserId } from '@decorators/user-id.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getAdminOrdersUseCase: GetAdminOrdersUseCase,
    private readonly updateOrderItemsUseCase: UpdateOrderItemsUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly getMyOrdersUseCase: GetMyOrdersUseCase,
  ) {}

  @Post()
  @ApiBearerAuth()
  async createOrder(
    @Body() dto: CreateOrderDto, 
    @CurrentUserId() userId: string 
  ) {
    return await this.createOrderUseCase.execute(userId, dto);
  }

  @Get('admin')
  async getAdminOrders() {
    return await this.getAdminOrdersUseCase.execute();
  }

  @Patch('admin/:id/items')
  async updateOrderItems(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderItemsDto,
  ) {
    return await this.updateOrderItemsUseCase.execute(orderId, dto);
  }

  @Patch('admin/:id/status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return await this.updateOrderStatusUseCase.execute(orderId, dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current login user orders (Order History)' })
  @ApiResponse({ status: 200, description: 'Return order list' })
  async getMyOrders(
    @CurrentUserId() userId: string 
  ) {
    return this.getMyOrdersUseCase.execute(userId);
  }
}