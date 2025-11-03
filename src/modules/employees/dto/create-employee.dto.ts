import { CreateNaturalPersonDto } from 'src/modules/natural-persons/dto/create-natural-person.dto';
import { TypeOfEmployee } from 'src/common/enums/type-of-employee.enum';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @ValidateNested()
  @Type(() => CreateNaturalPersonDto)
  @IsNotEmpty()
  @ApiProperty({ type: CreateNaturalPersonDto })
  natural_person: CreateNaturalPersonDto;

  @IsEnum(TypeOfEmployee)
  @IsNotEmpty()
  @ApiProperty({
    example: TypeOfEmployee.VETERINARIAN,
    enum: TypeOfEmployee,
    description: 'Rol del empleado',
  })
  type_of_employee: TypeOfEmployee;
}
