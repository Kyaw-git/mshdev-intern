import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class GetMyOrdersUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    return await this.prisma.order.findMany({
      where: {
        user_id: userId,
      },
      include: {
       order_lines: true, 
      },
      orderBy: {
        created_at: 'desc', 
      },
    });
  }
}