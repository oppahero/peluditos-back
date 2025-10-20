import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from 'src/common/enums/rol.enum';

export class UserResponseDto {
  @ApiProperty({ example: 99 })
  readonly users_id: number;

  @ApiProperty({
    example: UserRoles.VETERINARIO,
    enum: UserRoles,
    description: 'Rol del usuario',
  })
  readonly rol: UserRoles;

  @ApiProperty({ example: 'plopez707' })
  readonly username: string;
}
