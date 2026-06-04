import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminActionDto, AdminAction } from '../dtos/admin-action.dto';
import { MailService } from '../../../mail/mail.service';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class AdminHandleActionUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async execute(id: string, dto: AdminActionDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.status !== 'PENDING') {
      throw new NotFoundException('Pending user request not found');
    }
    const finalStatus = dto.action === AdminAction.ACCEPT ? 'APPROVED' : 'REJECTED';

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { status: finalStatus },
    });

    try {
      await this.mailService.sendStatusNotification(user.email, finalStatus);
    } catch (mailError) {
      console.error('Failed to send status notification email:', mailError);
    }

    return {
      message: `User registration request has been successfully ${finalStatus.toLowerCase()}.`,
      user_id: updatedUser.id,
      status: updatedUser.status,
    };
  }
}