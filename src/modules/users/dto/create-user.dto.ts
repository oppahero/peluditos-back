import { UserRoles } from 'src/common/enums/rol.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  @ApiProperty({ example: 'rlopez123' })
  username: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({ example: '123456' })
  password: string;

  @IsEnum(UserRoles, {
    message: 'El rol debe ser Administrador o Veterinario',
  })
  @IsNotEmpty()
  @ApiProperty({
    example: UserRoles.VETERINARIO,
    enum: UserRoles,
    description: 'Rol del usuario',
  })
  rol: UserRoles;
}
