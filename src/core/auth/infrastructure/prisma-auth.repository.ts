import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthRepository } from '../domain/repositories/auth.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { Auth } from '../domain/entities/auth.entity';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(record: any): Auth {
    return Auth.create({
      id: record.id,
      name: record.name,
      email: record.email,
      password: record.password,
      role: record.role,
      status: record.status,         
      phone_no: record.phone_no,
      avatar_url: record.avatar_url,
      created_at: record.createdAt || record.created_at,
      updated_at: record.updatedAt || record.updated_at,
    });
  }

  async findByEmail(email: string): Promise<Auth | null> {
    const record = await this.prisma.user.findUnique({
      where: { email },
    });

    return record ? this.toDomain(record) : null;
  }

  async findById(id: string): Promise<Auth | null> {
    const record = await this.prisma.user.findUnique({
      where: { id },
    });

    return record ? this.toDomain(record) : null;
  }

  async save(user: Auth, tx?: Prisma.TransactionClient): Promise<Auth> {
    const data = user.toPrimitives();
    const client = tx || this.prisma; 


    const record = await (client as any).user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        status: data.status,
        phone_no: data.phone_no,
        avatar_url: data.avatar_url,
      },
    });

    return this.toDomain(record);
  }
}