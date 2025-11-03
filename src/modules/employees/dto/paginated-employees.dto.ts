import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { EmployeeResponseDto } from './employee-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedEmployeesDto extends PaginatedDto<EmployeeResponseDto> {
  @ApiProperty({ type: [EmployeeResponseDto] })
  items: EmployeeResponseDto[] = [];
}
