import { Gender, ProductStatus } from '@prisma/client';
import { randomUUID } from 'node:crypto';

export interface VariantProps {
  id?: string;
  product_id?: string;
  size: string;
  color: string;
  stock: number;
  status: ProductStatus;
}

export interface ImageProps {
  id?: string;
  product_id?: string;
  image_url: string;
  is_primary: boolean;
}

export interface ProductProps {
  id?: string;
  name: string;
  description?: string | null;
  category: string;
  brand?: string | null;
  gender: Gender;
  price: number;
  variants: VariantProps[];
  images: ImageProps[];
  created_at?: Date;
  updated_at?: Date;
}

export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public category: string,
    public brand: string | null,
    public gender: Gender,
    public price: number,
    public variants: VariantProps[],
    public images: ImageProps[],
    public created_at: Date,
    public updated_at: Date,
  ) {}

  static create(props: Partial<ProductProps>): Product {
    if (props.price !== undefined && props.price < 0) {
      throw new Error('must be greater than 0');
    }

    return new Product(
      props.id ?? randomUUID(),
      props.name!,
      props.description ?? null,
      props.category!,
      props.brand ?? null,
      props.gender ?? Gender.UNISEX,
      props.price!,
      props.variants ?? [],
      props.images ?? [],
      props.created_at ?? new Date(),
      props.updated_at ?? new Date(),
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      brand: this.brand,
      gender: this.gender,
      price: this.price,
      variants: this.variants,
      images: this.images,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
