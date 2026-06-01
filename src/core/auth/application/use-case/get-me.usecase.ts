import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(AuthRepository)
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}

