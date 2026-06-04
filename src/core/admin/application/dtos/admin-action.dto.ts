import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum AdminAction {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT'
}

export class AdminActionDto {
  @ApiProperty({ example: 'ACCEPT', enum: AdminAction })
  @IsEnum(AdminAction)
  @IsNotEmpty()
  action!: AdminAction;
}