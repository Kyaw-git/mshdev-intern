import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class VerifyOtpUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: VerifyOtpDto) {
    const otpRecord = await this.prisma.otpVerification.findFirst({
      where: { email: dto.email, code: dto.code },
      orderBy: { created_at: 'desc' },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP code');
    }

    if (new Date() > otpRecord.expires_at) {
      throw new BadRequestException('OTP code has expired');
    }

    await this.prisma.otpVerification.deleteMany({ where: { email: dto.email } });

    return {
      message: 'OTP verified successfully. Your registration is now pending admin approval.',
      status: 'ADMIN_APPROVAL_PENDING',
    };
  }
}