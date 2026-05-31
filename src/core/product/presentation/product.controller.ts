import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductUseCase } from '../application/use-case/create-product.usecase';
import { FindAllProductsUseCase } from '../application/use-case/find-all-products.usecase'; // 🔥 အသစ်ဆောက်ခဲ့တဲ့ UseCase ကို Import လုပ်ပါ
import { CreateProductDto } from '../application/dtos/create-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly findAllProductsUseCase: FindAllProductsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product catalog' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  async create(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully.' })
  async findAll() {
    return this.findAllProductsUseCase.execute();
  }
}