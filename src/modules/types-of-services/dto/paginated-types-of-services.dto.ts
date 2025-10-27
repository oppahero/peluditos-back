import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { TypeOfServiceResponseDto } from './type-of-service-response.dto';

export class PaginatedTypesOfServicesDto extends PaginatedDto<TypeOfServiceResponseDto> {
  @ApiProperty({ type: [TypeOfServiceResponseDto] })
  items: TypeOfServiceResponseDto[] = [];
}
