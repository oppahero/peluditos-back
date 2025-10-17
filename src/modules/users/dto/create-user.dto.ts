import { IsString, MinLength, MaxLength, IsEnum } from 'class-validator';
import { UserRoles } from 'src/common/enums/rol.enum';

export class CreateUserDto {
  @IsString()
  @MaxLength(10)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRoles, {
    message: 'El rol debe ser Administrador o Veterinario',
  })
  rol: UserRoles;
}
