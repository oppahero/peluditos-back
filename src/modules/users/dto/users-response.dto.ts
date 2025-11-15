import { UserRoles } from 'src/common/enums/rol.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ example: 99 })
  @Expose()
  readonly users_id: number;

  @ApiProperty({
    example: UserRoles.VETERINARIAN,
    enum: UserRoles,
    description: 'Rol del usuario',
  })
  @Expose()
  readonly rol: UserRoles;

  @ApiProperty({ example: 'plopez707' })
  @Expose()
  readonly username: string;
}
