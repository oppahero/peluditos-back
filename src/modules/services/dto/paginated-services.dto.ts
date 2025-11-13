import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceResponseDto } from './service-response.dto';

export class PaginatedServicesDto extends PaginatedDto<ServiceResponseDto> {
  @ApiProperty({ type: [ServiceResponseDto] })
  items: ServiceResponseDto[] = [];
}
