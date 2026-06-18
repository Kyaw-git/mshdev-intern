import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductVariantDto {
  @ApiProperty({
    description: 'The ID of the existing product variant',
    example: 'variant-uuid-123',
  })
  @IsString()
  id!: string;

  @ApiPropertyOptional({ description: 'Update size', example: 'XL' })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiPropertyOptional({ description: 'Update color', example: 'Black' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ description: 'Update stock count', example: 50 })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({ description: 'Update status', example: 'IN_STOCK' })
  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Classic Cotton T-Shirt v2' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description here' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'T-Shirts' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'Nike' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ example: 'UNISEX' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ example: 29.99 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    type: [UpdateProductVariantDto],
    description: 'List of product variants to update (including stock)',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductVariantDto)
  variants?: UpdateProductVariantDto[];
}
