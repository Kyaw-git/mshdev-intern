import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string, dto: UpdateProductDto) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const updatedRecord = await (this.productRepository as any).update(id, dto);

    return {
      message: 'Product updated successfully',
      product_id: updatedRecord.id,
      updated_at: updatedRecord.updated_at,
    };
  }
}