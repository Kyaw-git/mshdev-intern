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
import { FindAllProductsUseCase } from '../application/use-case/find-all-products.usecase';
import { CreateProductDto } from '../application/dtos/create-product.dto';
import { DeleteProductUseCase } from '../application/use-case/delete-product.usecase';
import { UpdateProductUseCase } from '../application/use-case/update-product.usecase';
import { UpdateProductDto } from '../application/dtos/update-product.dto';
import { FindByIdProductUseCase } from '../application/use-case/find-by-id-product.usecase';
import { NotificationService } from '../../notification/notification.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly findAllProductsUseCase: FindAllProductsUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly findByIdProductUseCase: FindByIdProductUseCase,
    private readonly notiService: NotificationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product catalog' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  async create(@Body() dto: CreateProductDto) {
    const newProduct = await this.createProductUseCase.execute(dto);

    const fallbackUserId = 'ADMIN_OR_TEST_USER_ID';

    try {
      const createdProductId = newProduct?.product_id || 'Catalog';

      await this.notiService.createNotification(
        fallbackUserId,
        null,
        '✨ New Product Arrived!',
        `A new item has been added to the store (ID: ${createdProductId}). Check it out now!`,
      );
    } catch (err: any) {
      console.error('Notification failed in product creation:', err.message);
    }

    return newProduct;
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
    const updatedProduct = await this.updateProductUseCase.execute(id, dto);

    const fallbackUserId = 'ADMIN_OR_TEST_USER_ID';

    try {
      await this.notiService.createNotification(
        fallbackUserId,
        null,
        '🛍️ Product Updated!',
        `The details for product ID #${id.slice(-6)} have been updated successfully.`,
      );
    } catch (err: any) {
      console.error('Notification failed in product updation:', err.message);
    }

    return updatedProduct;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findById(@Param('id') id: string) {
    return this.findByIdProductUseCase.execute(id);
  }
}
