import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { PersonResponseDto } from './person-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedPersonsDto extends PaginatedDto<PersonResponseDto> {
  @ApiProperty({ type: [PersonResponseDto] })
  items: PersonResponseDto[] = [];
}
