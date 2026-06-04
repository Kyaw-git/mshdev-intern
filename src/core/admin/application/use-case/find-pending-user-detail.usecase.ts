import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class FindPendingUserDetailUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.status !== 'PENDING') {
      throw new NotFoundException('Pending user registration request not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_no: user.phone_no,
      avatar_url: user.avatar_url,
      status: user.status,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}