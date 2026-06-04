import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Mg Mg' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'mgmg@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '09123456789' }) 
  @IsString()
  @IsNotEmpty()
  phone_no!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({ example: 'https://example.com/uploads/avatar.jpg' })
  @IsString()
  @IsOptional()
  avatar_url?: string;
}