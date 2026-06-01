import { JwtService } from '@nestjs/jwt';
import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Req, UnauthorizedException, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUseCase } from '../application/use-case/register.usecase';
import { LoginUseCase } from '../application/use-case/login.usecase';
import { RegisterDto } from '../application/dtos/register.dto';
import { LoginDto } from '../application/dtos/login.dto';
import { GetMeUseCase } from '../application/use-case/get-me.usecase';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  private readonly getMeUseCase: GetMeUseCase,

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
@Get("profile")
  @ApiBearerAuth("JWT-auth")
  async me(@Req() req: any, @Query('token') queryToken?: string) {
    const token = queryToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token is missing from both query and headers');
    }

    try {
      // 2. Decode Token
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      const userId = payload.sub || payload.id;

      if (!userId) {
        throw new UnauthorizedException('User identifier missing from token');
      }

      return await this.getMeUseCase.execute(userId);
    } catch (error) {
      throw new UnauthorizedException('Invalid or malformed token');
    }

}

}