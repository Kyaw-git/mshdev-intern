import { IsArray, IsNotEmpty, IsString, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderItemDto {
  @ApiProperty({ type: String, description: 'The Order Line ID from the order detail' })
  @IsString()
  @IsNotEmpty()
  order_line_id!: string;

  @ApiProperty({ type: Number, description: 'New quantity of the item', default: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class UpdateOrderItemsDto {
  @ApiProperty({ type: [UpdateOrderItemDto], description: 'Array of items to update' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items!: UpdateOrderItemDto[];
}