import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({
    type: String,
    description: 'The Product Variant ID from Supabase',
  })
  @IsString()
  @IsNotEmpty()
  variant_id!: string;

  @ApiProperty({ type: Number, description: 'Quantity of items', default: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto], description: 'Array of order items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
