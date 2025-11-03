import { LegalEntityResponseDto } from './legal-entity-response.dto';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedLegalEntitiesDto extends PaginatedDto<LegalEntityResponseDto> {
  @ApiProperty({ type: [LegalEntityResponseDto] })
  items: LegalEntityResponseDto[] = [];
}
