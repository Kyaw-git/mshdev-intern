import { ApiProperty } from '@nestjs/swagger';
import { Gender, ProductStatus } from '@prisma/client';
import {
  IsEnum,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateVariantDto {
  @ApiProperty({ example: 'M' })
  @IsString()
  @IsNotEmpty()
  size!: string;

  @ApiProperty({ example: 'Black' })
  @IsString()
  @IsNotEmpty()
  color!: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  stock!: number;

  @ApiProperty({ enum: ProductStatus, example: ProductStatus.IN_STOCK })
  @IsEnum(ProductStatus)
  status!: ProductStatus;
}

class CreateImageDto {
  @ApiProperty({ example: 'https://example.com/images/shirt-black.jpg' })
  @IsString()
  @IsNotEmpty()
  image_url!: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Classic Cotton T-Shirt' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Premium quality 100% cotton t-shirt', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'T-Shirts' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ example: 'Nike', required: false })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ enum: Gender, example: Gender.UNISEX })
  @IsEnum(Gender)
  gender!: Gender;

  @ApiProperty({ example: 25.5 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ type: [CreateVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants!: CreateVariantDto[];

  @ApiProperty({ type: [CreateImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images!: CreateImageDto[];
}