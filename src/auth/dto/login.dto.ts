import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @ApiProperty({ example: 'mlopez707', description: 'Nombre de usuario' })
  username: string;

  @IsString()
  @ApiProperty({ example: '123456', description: 'Contraseña del usuario' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
