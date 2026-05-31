import { Module } from '@nestjs/common';
import { ProductController } from './presentation/product.controller';
import { CreateProductUseCase } from './application/use-case/create-product.usecase';
import { ProductRepository } from './domain/repositories/product.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaProductRepository } from './infrastructure/prisma-product.repository';
import { FindAllProductsUseCase } from './application/use-case/find-all-products.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    FindAllProductsUseCase,
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
  ],
})
export class ProductModule {}