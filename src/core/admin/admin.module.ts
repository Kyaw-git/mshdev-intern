import { Module } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { AdminUserController } from './presentation/admin-user.controller';
import { FindPendingUsersUseCase } from './application/use-case/find-pending-users.usecase';
import { FindPendingUserDetailUseCase } from './application/use-case/find-pending-user-detail.usecase';
import { AdminHandleActionUseCase } from './application/use-case/admin-handle-action.usecase';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [AdminUserController],
  providers: [
    PrismaService,
    MailService,
    FindPendingUsersUseCase,
    FindPendingUserDetailUseCase,
    AdminHandleActionUseCase,
  ],
})
export class AdminModule {}