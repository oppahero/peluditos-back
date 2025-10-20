import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { UserResponseDto } from './users-response.dto';

export class PaginatedUsersDto extends PaginatedDto<UserResponseDto> {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[] = [];
}
