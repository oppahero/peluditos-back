import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PetResponseDto } from './pet-response.dto';

export class PaginatedPetsDto extends PaginatedDto<PetResponseDto> {
  @ApiProperty({ type: [PetResponseDto] })
  items: PetResponseDto[] = [];
}
