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
import { NotificationService } from '../../notification/notification.service';

// @ApiTags('Products')
// @Controller('products')
// export class ProductController {
//   constructor(
//     private readonly createProductUseCase: CreateProductUseCase,
//     private readonly findAllProductsUseCase: FindAllProductsUseCase,
//     private readonly deleteProductUseCase: DeleteProductUseCase,
//     private readonly updateProductUseCase: UpdateProductUseCase,
//     private readonly findByIdProductUseCase: FindByIdProductUseCase,
//     private notiService: NotificationService,
//   ) {}

//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   @ApiOperation({ summary: 'Create a new product catalog' })
//   @ApiResponse({ status: 201, description: 'Product created successfully.' })
//   async create(@Body() dto: CreateProductDto) {
//     return this.createProductUseCase.execute(dto);
//   }

//   @Get()
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Get all products' })
//   @ApiResponse({ status: 200, description: 'Products retrieved successfully.' })
//   async findAll() {
//     return this.findAllProductsUseCase.execute();
//   }

//   @Delete(':id')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Delete a product by ID' })
//   @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
//   @ApiResponse({ status: 404, description: 'Product not found.' })
//   async delete(@Param('id') id: string) {
//     return this.deleteProductUseCase.execute(id);
//   }

//   @Patch(':id')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Update a product by ID' })
//   @ApiResponse({ status: 200, description: 'Product updated successfully.' })
//   @ApiResponse({ status: 404, description: 'Product not found.' })
//   async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
//     return this.updateProductUseCase.execute(id, dto);
//   }


//   @Get(':id')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Get a product by ID' })
//   @ApiResponse({ status: 200, description: 'Product retrieved successfully.' })
//   @ApiResponse({ status: 404, description: 'Product not found.' })
//   async findById(@Param('id') id: string) {
//     return this.findByIdProductUseCase.execute(id);
//   }
// }
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

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ summary: 'Create a new product catalog' })
  // @ApiResponse({ status: 201, description: 'Product created successfully.' })
  // async create(@Body() dto: CreateProductDto) {
  //   const newProduct = await this.createProductUseCase.execute(dto);
  //   await this.notiService.createNotification(
  //     '✨ New Product Arrived!',
  //     `A new item "${newProduct?.name || 'New Product'}" has been added to the store. Check it out now!`
  //   );

  //   return newProduct;
  // }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product catalog' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  async create(@Body() dto: CreateProductDto) {
    const newProduct = await this.createProductUseCase.execute(dto);

    await this.notiService.createNotification(
      '✨ New Product Arrived!',
      `A new item has been added to the store (ID: ${newProduct?.product_id || 'Catalog'}). Check it out now!`
    );

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

  // @Patch(':id')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Update a product by ID' })
  // @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  // @ApiResponse({ status: 404, description: 'Product not found.' })
  // async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
  //   const updatedProduct = await this.updateProductUseCase.execute(id, dto);

  //   await this.notiService.createNotification(
  //     '🛍️ Product Updated!',
  //     `The details for "${updatedProduct?.name || 'a product'}" have been updated by admin.`
  //   );

  //   return updatedProduct;
  // }
  
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const updatedProduct = await this.updateProductUseCase.execute(id, dto);
    await this.notiService.createNotification(
      '🛍️ Product Updated!',
      `The details for product ID: ${id} have been updated by admin.`
    );

    return updatedProduct;
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