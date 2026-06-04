import { Module } from '@nestjs/common';
import { ProductController } from './presentation/product.controller';
import { CreateProductUseCase } from './application/use-case/create-product.usecase';
import { ProductRepository } from './domain/repositories/product.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaProductRepository } from './infrastructure/prisma-product.repository';
import { FindAllProductsUseCase } from './application/use-case/find-all-products.usecase';
import { DeleteProductUseCase } from './application/use-case/delete-product.usecase';
import { UpdateProductUseCase } from './application/use-case/update-product.usecase';
import { FindByIdProductUseCase } from './application/use-case/find-by-id-product.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    FindAllProductsUseCase,
    DeleteProductUseCase,
    UpdateProductUseCase,
    FindByIdProductUseCase,
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
  ],
})
export class ProductModule {}