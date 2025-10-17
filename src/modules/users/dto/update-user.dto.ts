import { UserRoles } from 'src/common/enums/rol.enum';
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
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(UserRoles, {
    message: 'El rol debe ser Administrador o Veterinario',
  })
  rol?: UserRoles;
}
