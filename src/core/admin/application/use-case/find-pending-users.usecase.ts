import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class FindPendingUsersUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    const pendingUsers = await this.prisma.user.findMany({
      where: {
        status: 'PENDING',
        role: 'USER',
      },
      orderBy: { created_at: 'desc' },
    });

    return pendingUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone_no: user.phone_no,
      avatar_url: user.avatar_url,
      status: user.status,
      created_at: user.created_at,
    }));
  }
}