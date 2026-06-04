import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductUseCase } from '../application/use-case/create-product.usecase';
import { FindAllProductsUseCase } from '../application/use-case/find-all-products.usecase'; // 🔥 အသစ်ဆောက်ခဲ့တဲ့ UseCase ကို Import လုပ်ပါ
import { CreateProductDto } from '../application/dtos/create-product.dto';
import { DeleteProductUseCase } from '../application/use-case/delete-product.usecase';
import { UpdateProductUseCase } from '../application/use-case/update-product.usecase';
import { UpdateProductDto } from '../application/dtos/update-product.dto';
import { FindByIdProductUseCase } from '../application/use-case/find-by-id-product.usecase';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly findAllProductsUseCase: FindAllProductsUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly findByIdProductUseCase: FindByIdProductUseCase,
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

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async delete(@Param('id') id: string) {
    return this.deleteProductUseCase.execute(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.updateProductUseCase.execute(id, dto);
  }


  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findById(@Param('id') id: string) {
    return this.findByIdProductUseCase.execute(id);
  }
}