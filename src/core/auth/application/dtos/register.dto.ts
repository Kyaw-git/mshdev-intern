import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Mg Mg' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'mgmg@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;
}