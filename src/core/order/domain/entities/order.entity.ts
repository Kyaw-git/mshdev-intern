export class OrderItemEntity {
  id!: string;
  variant_id!: string;
  quantity!: number;
  price!: number;
  product_name?: string;
}

export class OrderEntity {
  id!: string;
  user_id!: string;
  total_amount!: number;
  status!: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  created_at!: Date;
  updated_at!: Date;
  items!: OrderItemEntity[];
}