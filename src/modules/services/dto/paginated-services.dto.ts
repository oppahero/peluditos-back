import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { PetResponseDto } from './service-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedServicesDto extends PaginatedDto<PetResponseDto> {
  @ApiProperty({ type: [PetResponseDto] })
  items: PetResponseDto[] = [];
}
