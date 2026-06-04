import { Body, Controller, Get, Patch, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindPendingUsersUseCase } from '../application/use-case/find-pending-users.usecase';
import { FindPendingUserDetailUseCase } from '../application/use-case/find-pending-user-detail.usecase';
import { AdminHandleActionUseCase } from '../application/use-case/admin-handle-action.usecase';
import { AdminActionDto } from '../application/dtos/admin-action.dto';

@ApiTags('Admin - User Management')
@Controller('admin/users')
export class AdminUserController {
  constructor(
    private readonly findPendingUsersUseCase: FindPendingUsersUseCase,
    private readonly findPendingUserDetailUseCase: FindPendingUserDetailUseCase,
    private readonly adminHandleActionUseCase: AdminHandleActionUseCase,
  ) {}

  @Get('pending')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all pending registration requests' })
  @ApiResponse({ status: 200, description: 'List fetched successfully.' })
  async getPendingUsers() {
    return this.findPendingUsersUseCase.execute();
  }

  @Get('pending/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get details of a pending user (including profile image)' })
  @ApiResponse({ status: 200, description: 'User detail retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Pending user not found.' })
  async getPendingUserDetail(@Param('id') id: string) {
    return this.findPendingUserDetailUseCase.execute(id);
  }

  @Patch(':id/action')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept or Reject a pending user registration' })
  @ApiResponse({ status: 200, description: 'Action performed and email notification sent.' })
  @ApiResponse({ status: 404, description: 'Pending user not found.' })
  async handleUserAction(@Param('id') id: string, @Body() dto: AdminActionDto) {
    return this.adminHandleActionUseCase.execute(id, dto);
  }
}