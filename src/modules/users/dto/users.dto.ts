import { UserRoles } from 'src/common/enums/rol.enum';

export class UserResponseDto {
  readonly users_id: number;
  readonly rol: UserRoles;
  readonly username: string;
}
