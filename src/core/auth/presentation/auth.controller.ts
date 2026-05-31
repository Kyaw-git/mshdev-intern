import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUseCase } from '../application/use-case/register.usecase';
import { LoginUseCase } from '../application/use-case/login.usecase';
import { RegisterDto } from '../application/dtos/register.dto';
import { LoginDto } from '../application/dtos/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User register' })
  async register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }


  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'login success' })
  @ApiResponse({ status: 401, description: 'Email or password is incorrect' })
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}