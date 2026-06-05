import { Auth } from '../entities/auth.entity';
import { Prisma } from '@prisma/client';

export interface AuthRepository {
  findByEmail(email: string): Promise<Auth | null>;
  findById(id: string): Promise<Auth | null>;
  save(user: Auth, tx?: Prisma.TransactionClient): Promise<Auth>;
  // findAll(status?: string): Promise<Auth[]>;
}

export const AuthRepository = Symbol('AuthRepository');