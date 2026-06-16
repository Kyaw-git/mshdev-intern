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

    try {
      this.mailService.sendOtp(savedUser.email, otpCode).catch((err) => {
        console.error('📧 [Resend OTP Background Error]:', err.message);
      });
    } catch (mailError: any) {
      console.error('❌ Failed to trigger Resend OTP email process:', mailError.message);
    }

    return {
      message: 'Registration initiated successfully. OTP code has been sent to your email.',
      email: savedUser.email,
      status: 'OTP_SENT',
    };
  }
}