import { UpdateNaturalPersonDto } from 'src/modules/natural-persons/dto/update-natural-person.dto';
import { ValidateNested, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TypeOfEmployee } from 'src/common/enums/type-of-employee.enum';

export class UpdateEmployeeDto {
  @ValidateNested()
  @Type(() => UpdateNaturalPersonDto)
  @IsNotEmpty()
  @ApiProperty({ type: UpdateNaturalPersonDto })
  natural_person: UpdateNaturalPersonDto;

  @IsEnum(TypeOfEmployee)
  @IsNotEmpty()
  @ApiProperty({
    example: TypeOfEmployee.VETERINARIAN,
    enum: TypeOfEmployee,
    description: 'Rol del usuario',
  })
  type_of_employee: TypeOfEmployee;
}
