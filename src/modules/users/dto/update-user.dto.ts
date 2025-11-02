import { UserRoles } from 'src/common/enums/rol.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  @ApiProperty({ example: 'rlopez123' })
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiProperty({ example: '123456' })
  password?: string;

  @IsOptional()
  @IsEnum(UserRoles, {
    message: 'El rol debe ser Administrador o Veterinario',
  })
  @ApiProperty({
    example: UserRoles.VETERINARIAN,
    enum: UserRoles,
    description: 'Rol del usuario',
  })
  rol?: UserRoles;
}
