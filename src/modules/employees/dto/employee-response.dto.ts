import { NaturalPersonResponseDto } from 'src/modules/natural-persons/dto/natural-person-response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TypeOfEmployee } from 'src/common/enums/type-of-employee.enum';

export class EmployeeResponseDto {
  @ApiProperty({ example: 10 })
  @Expose()
  readonly person_id: number;

  @ApiProperty({ type: NaturalPersonResponseDto })
  @Expose()
  @Type(() => NaturalPersonResponseDto)
  readonly natural_person: NaturalPersonResponseDto;

  @ApiProperty({ example: 'Veterinario' })
  @Expose()
  @ApiProperty({
    example: TypeOfEmployee.VETERINARIAN,
    enum: TypeOfEmployee,
    description: 'Rol del empleado',
  })
  type_of_employee: TypeOfEmployee;

  @ApiProperty({ example: true })
  @Expose()
  readonly status: boolean;

  @ApiProperty({ example: '2025-11-01T17:00:00.000Z' })
  @Expose()
  readonly created_at: Date;

  @ApiProperty({ example: '2025-11-01T17:05:00.000Z' })
  @Expose()
  readonly updated_at: Date;
}

export class EmployeeEmbeddedDto extends OmitType(EmployeeResponseDto, [
  'natural_person',
] as const) {}
