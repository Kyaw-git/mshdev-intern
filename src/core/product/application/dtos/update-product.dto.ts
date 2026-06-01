import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Classic Cotton T-Shirt v2' })
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description here' })
  description?: string;

  @ApiPropertyOptional({ example: 'T-Shirts' })
  category?: string;

  @ApiPropertyOptional({ example: 'Nike' })
  brand?: string;

  @ApiPropertyOptional({ example: 'UNISEX' })
  gender?: string;

  @ApiPropertyOptional({ example: 29.99 })
  price?: number;
}