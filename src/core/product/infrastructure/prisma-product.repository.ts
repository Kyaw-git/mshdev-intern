import { Injectable } from '@nestjs/common';
import { Prisma, ProductStatus } from '@prisma/client';
import { ProductRepository } from '../domain/repositories/product.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { Product } from '../domain/entities/product.entity';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(record: any): Product {
    return Product.create({
      id: record.id,
      name: record.name,
      description: record.description,
      category: record.category,
      brand: record.brand,
      gender: record.gender,
      price: record.price ? Number(record.price) : 0,
      variants: record.variants
        ? record.variants.map((v: any) => ({
            id: v.id,
            product_id: v.product_id,
            size: v.size,
            color: v.color,
            stock: v.stock,
            status: v.status as ProductStatus,
          }))
        : [],
      images: record.images
        ? record.images.map((img: any) => ({
            id: img.id,
            product_id: img.product_id,
            image_url: img.image_url ?? img.imageUrl,
            is_primary: img.is_primary ?? img.isPrimary,
          }))
        : [],
      created_at: record.created_at ?? record.createdAt,
      updated_at: record.updated_at ?? record.updatedAt,
    });
  }

  async save(
    product: Product,
    tx?: Prisma.TransactionClient,
  ): Promise<Product> {
    const data = product.toPrimitives();
    const client = tx || this.prisma;
    const decimalPrice = new Prisma.Decimal(data.price);

    const record = await (client as any).product.create({
      data: {
        id: data.id,
        name: data.name,
        description: data.description,
        category: data.category,
        brand: data.brand,
        gender: data.gender,
        price: decimalPrice,
        variants: {
          create: data.variants.map((v: any) => ({
            size: v.size,
            color: v.color,
            stock: v.stock,
            status: v.status,
          })),
        },
        images: {
          create: data.images.map((img: any) => ({
            image_url: img.image_url,
            is_primary: img.is_primary ?? false,
          })),
        },
      },
      include: {
        variants: true,
        images: true,
      },
    });

    return this.toDomain(record);
  }

  async findAll(): Promise<Product[]> {
    const records = await this.prisma.product.findMany({
      include: { variants: true, images: true },
    });
    return records.map((record) => this.toDomain(record));
  }

  async findById(id: string): Promise<Product | null> {
    const record = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true, images: true },
    });
    return record ? this.toDomain(record) : null;
  }

  async delete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx || this.prisma;
    await (client as any).product.delete({
      where: { id },
    });
  }

  async update(
    id: string,
    data: any,
    tx?: Prisma.TransactionClient,
  ): Promise<any> {
    const client = tx || this.prisma;

    const updatedProduct = await (client as any).product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        brand: data.brand,
        gender: data.gender,
        price:
          data.price !== undefined ? new Prisma.Decimal(data.price) : undefined,
      },
    });

    if (data.variants && Array.isArray(data.variants)) {
      for (const variant of data.variants) {
        if (variant.id) {
          await (client as any).productVariant.update({
            where: { id: variant.id },
            data: {
              size: variant.size,
              color: variant.color,
              stock:
                variant.stock !== undefined ? Number(variant.stock) : undefined,
              status: variant.status,
            },
          });
        }
      }
    }

    return updatedProduct;
  }
}
