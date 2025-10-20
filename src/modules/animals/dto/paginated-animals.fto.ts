import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { AnimalResponseDto } from './animals-response.dto';

export class PaginatedAnimalsDto extends PaginatedDto<AnimalResponseDto> {
  @ApiProperty({ type: [AnimalResponseDto] })
  data: AnimalResponseDto[] = [];
}
