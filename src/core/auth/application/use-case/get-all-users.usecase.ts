import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(status?: string) {
    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phone_no: true,
        avatar_url: true,
        role: true,
        status: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return {
      message: status ? `${status} users fetched successfully` : 'All users fetched successfully',
      count: users.length,
      users,
    };
  }
}