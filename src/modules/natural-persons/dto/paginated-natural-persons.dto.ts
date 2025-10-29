import { NaturalPersonResponseDto } from './natural-person-response.dto';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedNaturalPersonsDto extends PaginatedDto<NaturalPersonResponseDto> {
  @ApiProperty({ type: [NaturalPersonResponseDto] })
  items: NaturalPersonResponseDto[] = [];
}
