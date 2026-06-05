import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { HashService } from '../../../../modules/hash-service/hash.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../../prisma/prisma.service';

// @Injectable()
// export class LoginUseCase {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly jwtService: JwtService,
//   ) {}

//   async execute(dto: LoginDto) {
//     const user = await this.prisma.user.findUnique({
//       where: { email: dto.email },
//     });

//     if (!user || !(await bcrypt.compare(dto.password, user.password))) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     if (user.status === 'PENDING') {
//       throw new ForbiddenException(
//         'Your account is pending administrator approval.',
//       );
//     }

//     if (user.status === 'REJECTED') {
//       throw new ForbiddenException(
//         'Your registration request has been rejected.',
//       );
//     }

//     const payload = { sub: user.id, email: user.email, role: user.role };

//     return {
//       message: 'Login successful',
//       access_token: await this.jwtService.signAsync(payload),
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         role: user.role,
//         status: user.status,
//       },
//     };
//   }
// }

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === 'REJECTED') {
      throw new ForbiddenException(
        'Your registration request has been rejected by the administrator.',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    return {
      message: 'Login successful',
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    };
  }
}
