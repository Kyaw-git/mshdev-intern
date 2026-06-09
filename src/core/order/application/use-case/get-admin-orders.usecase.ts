import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class GetAdminOrdersUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    const orders = await this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone_no: true,
          },
        },
        order_lines: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    name: true,
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
      
      orderBy: [
        { status: 'asc' },
        { created_at: 'desc' },
      ],
    });

    return {
      message: 'Admin orders fetched successfully',
      count: orders.length,
      orders,
    };
  }
}