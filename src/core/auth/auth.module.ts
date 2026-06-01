import { Module } from '@nestjs/common';
import { RegisterUseCase } from './application/use-case/register.usecase';
import { AuthRepository } from './domain/repositories/auth.repository';
import { HashModule } from '../../modules/hash-service/hash.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaAuthRepository } from './infrastructure/prisma-auth.repository';
import { AuthController } from './presentation/auth.controller';
import { LoginUseCase } from './application/use-case/login.usecase';
import { JwtModule } from '@nestjs/jwt';
import { GetMeUseCase } from './application/use-case/get-me.usecase';

@Module({
  imports: [
    HashModule,
    PrismaModule,
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY_HERE',
      signOptions: { expiresIn: '1d' },
    }),

  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    GetMeUseCase,
    {
      provide: AuthRepository,
      useClass: PrismaAuthRepository,
    },
  ],
})
export class AuthModule {}
