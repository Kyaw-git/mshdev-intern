import { Injectable, Inject } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class FindAllProductsUseCase {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute() {
    const products = await this.productRepository.findAll();
    return products.map((product) => product.toPrimitives());
  }
}