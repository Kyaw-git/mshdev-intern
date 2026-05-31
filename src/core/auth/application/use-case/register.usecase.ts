import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { Auth } from '../../domain/entities/auth.entity';
import { Role } from '@prisma/client';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { HashService } from '../../../../modules/hash-service/hash.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(AuthRepository)
    private readonly authRepository: AuthRepository,

    @Inject(HashService)
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RegisterDto) {
    const existingUser = await this.authRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('email already exist');
    }

    const hashedPassword = await this.hashService.hash(dto.password);

    const authEntity = Auth.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: Role.USER,
    });

    const savedUser = await this.authRepository.save(authEntity);

    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'register successful',
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        created_at: savedUser.created_at,
        updated_at: savedUser.updated_at,
      },
      access_token: accessToken,
    };
  }
}
