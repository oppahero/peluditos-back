import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDetailDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  service_id: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 2 })
  type_of_service_id: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 22 })
  employee_id: number;
}
