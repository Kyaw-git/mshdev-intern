import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatusEnum {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export class UpdateOrderStatusDto {
  @ApiProperty({ 
    enum: OrderStatusEnum, 
    description: 'The new status of the order',
    example: 'APPROVED' 
  })
  @IsEnum(OrderStatusEnum, {
    message: 'Status must be APPROVED, REJECTED, or COMPLETED',
  })
  @IsNotEmpty()
  status!: OrderStatusEnum;
}