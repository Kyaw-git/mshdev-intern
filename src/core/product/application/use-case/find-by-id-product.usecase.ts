import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class FindByIdProductUseCase {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand,
      gender: product.gender,
      price: product.price,
      created_at: (product as any).created_at,
      updated_at: (product as any).updated_at,
      variants: ((product as any).variants || []).map((v: any) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        stock: v.stock,
        status: v.status,
        created_at: v.created_at,
        updated_at: v.updated_at,
      })),
      images: ((product as any).images || []).map((img: any) => ({
        id: img.id,
        image_url: img.image_url || img.imageUrl,
        is_primary: img.is_primary,
        created_at: img.created_at,
        updated_at: img.updated_at,
      })),
    };
  }
}