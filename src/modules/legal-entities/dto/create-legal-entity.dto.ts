import { TypesOfTaxpayer } from 'src/common/enums/types-of-taxpayer.enum';
import { CreatePersonDto } from 'src/modules/persons/dto/create-person.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class CreateLegalEntityDto {
  @ValidateNested()
  @Type(() => CreatePersonDto)
  @IsNotEmpty()
  @ApiProperty({
    example: {
      name: 'Inversiones GTP',
      phone: '02869621392',
      email: 'gtpp@gmail.com',
      address: 'Unare II',
      taxpayer_type: TypesOfTaxpayer.GUBERNAMENTAL,
    },
  })
  person: CreatePersonDto;

  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  @ApiProperty({ example: '12345678-9' })
  rif: string;
}
