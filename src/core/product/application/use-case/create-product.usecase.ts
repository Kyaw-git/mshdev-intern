import { Injectable, Inject } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(dto: CreateProductDto) {
    const productEntity = Product.create({
      name: dto.name,
      description: dto.description,
      category: dto.category,
      brand: dto.brand,
      gender: dto.gender,
      price: dto.price,
      variants: dto.variants,
      images: dto.images.map((img) => ({
        image_url: img.image_url,
        is_primary: img.is_primary ?? false,
      })),
    });

    const savedProduct = await this.productRepository.save(productEntity);

    return {
      message: 'Product created successfully',
      product_id: savedProduct.id,
    };
  }
}
