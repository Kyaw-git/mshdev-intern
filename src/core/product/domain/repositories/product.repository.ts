import { Product } from '../entities/product.entity';
import { Prisma } from '@prisma/client';

export interface ProductRepository {
  save(product: Product, tx?: Prisma.TransactionClient): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
}

export const ProductRepository = Symbol('ProductRepository');