import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OrderStatusEnum {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatusEnum,
    description: 'The new status of the order',
    example: 'APPROVED',
  })
  @IsEnum(OrderStatusEnum, {
    message: 'Status must be APPROVED, REJECTED, or COMPLETED',
  })
  @IsNotEmpty()
  status!: OrderStatusEnum;

  @ApiPropertyOptional({
    example: 'Your order has been approved and is being processed.',
    description: 'Custom Notification Message  by admin (optional)',
  })
  @IsString()
  @IsOptional()
  message?: string;
}
