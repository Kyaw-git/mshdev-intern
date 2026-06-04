// import { Injectable, ConflictException, Inject, BadRequestException } from '@nestjs/common';
// import { RegisterDto } from '../dtos/register.dto';
// import { Auth } from '../../domain/entities/auth.entity';
// import { Role } from '@prisma/client';
// import { AuthRepository } from '../../domain/repositories/auth.repository';
// import { HashService } from '../../../../modules/hash-service/hash.service';
// import { JwtService } from '@nestjs/jwt';
// import { PrismaService } from '../../../../prisma/prisma.service';
// import { MailService } from '../../../mail/mail.service';
// import * as bcrypt from 'bcrypt';
// @Injectable()
// export class RegisterUseCase {
//   constructor(
//     @Inject(AuthRepository)
//     private readonly authRepository: AuthRepository,

//     @Inject(HashService)
//     private readonly hashService: HashService,
//     private readonly jwtService: JwtService,
//   ) {}

//   async execute(dto: RegisterDto) {
//     const existingUser = await this.authRepository.findByEmail(dto.email);
//     if (existingUser) {
//       throw new ConflictException('email already exist');
//     }

//     const hashedPassword = await this.hashService.hash(dto.password);

//     const authEntity = Auth.create({
//       name: dto.name,
//       email: dto.email,
//       password: hashedPassword,
//       role: Role.USER,
//     });

//     const savedUser = await this.authRepository.save(authEntity);

//     const payload = {
//       sub: savedUser.id,
//       email: savedUser.email,
//       role: savedUser.role,
//     };

//     const accessToken = this.jwtService.sign(payload);

//     return {
//       message: 'register successful',
//       user: {
//         id: savedUser.id,
//         name: savedUser.name,
//         email: savedUser.email,
//         role: savedUser.role,
//         created_at: savedUser.created_at,
//         updated_at: savedUser.updated_at,
//       },
//       access_token: accessToken,
//     };
//   }
// }

// @Injectable()
// export class RegisterUseCase {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly mailService: MailService,
//   ) {}

//   async execute(dto: RegisterDto) {
//     const existingUser = await this.prisma.user.findFirst({
//       where: {
//         OR: [{ email: dto.email }, { phone_no: dto.phone_no }],
//       },
//     });

//     if (existingUser) {
//       if (existingUser.email === dto.email) {
//         throw new BadRequestException('Email already exists');
//       }
//       if (existingUser.phone_no === dto.phone_no) {
//         throw new BadRequestException('Phone number already exists');
//       }
//     }

//     const hashedPassword = await bcrypt.hash(dto.password, 10);
//     const user = await this.prisma.user.create({
//       data: {
//         email: dto.email,
//         phone_no: dto.phone_no,
//         password: hashedPassword,
//         name: dto.name,
//         avatar_url: dto.avatar_url,
//         status: 'PENDING',
//       },
//     });

//     const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

//     await this.prisma.otpVerification.create({
//       data: {
//         email: dto.email,
//         code: otpCode,
//         expires_at: expiresAt,
//       },
//     });

//     await this.mailService.sendOtp(dto.email, otpCode);

//     return {
//       message: 'Registration initiated. OTP code sent to email.',
//       email: user.email,
//       status: 'OTP_SENT',
//     };
//   }
// }


import { Injectable, Inject, BadRequestException, ConflictException } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { Auth } from '../../domain/entities/auth.entity';
import { Role } from '@prisma/client';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { HashService } from '../../../../modules/hash-service/hash.service';
import { PrismaService } from '../../../../prisma/prisma.service';
import { MailService } from '../../../mail/mail.service';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(AuthRepository)
    private readonly authRepository: AuthRepository,

    @Inject(HashService)
    private readonly hashService: HashService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async execute(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone_no: dto.phone_no }],
      },
    });

    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ConflictException('Email already exists');
      }
      if (existingUser.phone_no === dto.phone_no) {
        throw new ConflictException('Phone number already exists');
      }
    }

    const hashedPassword = await this.hashService.hash(dto.password);

    const authEntity = Auth.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      phone_no: dto.phone_no,
      avatar_url: dto.avatar_url,
      role: Role.USER,
      status: 'PENDING',
    });

    const savedUser = await this.authRepository.save(authEntity);

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.otpVerification.create({
      data: {
        email: savedUser.email,
        code: otpCode,
        expires_at: expiresAt,
      },
    });

    await this.mailService.sendOtp(savedUser.email, otpCode);

    return {
      message: 'Registration initiated successfully. OTP code has been sent to your email.',
      email: savedUser.email,
      status: 'OTP_SENT',
    };
  }
}
