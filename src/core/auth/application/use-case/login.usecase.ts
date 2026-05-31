import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { HashService } from '../../../../modules/hash-service/hash.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AuthRepository)
    private readonly authRepository: AuthRepository,

    @Inject(HashService)
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.authRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('invalid email or password');
    }

    const isPasswordMatch = await this.hashService.compare(
      dto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('invalid email or password');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      access_token: accessToken,
    };
  }
}