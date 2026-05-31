import { Auth } from '../entities/auth.entity'; // သင့် Entity နာမည် Auth ဆိုလျှင် Auth ဟုသုံးပါ (User ဆိုလျှင် User ဟုပြင်ပါ)
import { Prisma } from '@prisma/client';

export interface AuthRepository {
  findByEmail(email: string): Promise<Auth | null>;
  findById(id: string): Promise<Auth | null>;
  save(user: Auth, tx?: Prisma.TransactionClient): Promise<Auth>;
}

export const AuthRepository = Symbol('AuthRepository');