import { UpdatePersonDto } from 'src/modules/persons/dto/update-person.dto';
import { TypesOfTaxpayer } from 'src/common/enums/types-of-taxpayer.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class UpdateLegalEntityDto {
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  @IsOptional()
  @ApiProperty({
    example: {
      name: 'Inversiones GTP',
      phone: '02869621392',
      email: 'gtpp@gmail.com',
      address: 'Unare II',
      taxpayer_type: TypesOfTaxpayer.GUBERNAMENTAL,
    },
  })
  person?: UpdatePersonDto;

  @IsString()
  @MaxLength(10)
  @IsOptional()
  @ApiProperty({ example: '12345678-9' })
  rif?: string;
}
