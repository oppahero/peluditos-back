import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { BreedResponseDto } from './breed-response.dto';

export class PaginatedBreedsDto extends PaginatedDto<BreedResponseDto> {
  @ApiProperty({ type: [BreedResponseDto] })
  items: BreedResponseDto[] = [];
}
