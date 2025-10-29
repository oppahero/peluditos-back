import { UpdatePersonDto } from 'src/modules/persons/dto/update-person.dto';
import { TypesOfTaxpayer } from 'src/common/enums/types-of-taxpayer.enum';
import { Gender } from 'src/common/enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsString,
  MaxLength,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class UpdateNaturalPersonDto {
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  @IsOptional()
  @ApiProperty({
    example: {
      name: 'Paola López',
      phone: '04121939372',
      email: 'paola@gmail.com',
      address: 'Alta Vista',
      taxpayer_type: TypesOfTaxpayer.INDIVIDUAL,
    },
  })
  person?: UpdatePersonDto;

  @IsString()
  @MaxLength(9)
  @IsOptional()
  @ApiProperty({ example: '25040204' })
  dni?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({ example: new Date('11-15-1995') })
  birthdate?: Date;

  @IsEnum(Gender, {
    message: 'El genero debe ser F o M',
  })
  @IsOptional()
  @ApiProperty({
    example: Gender.FEMALE,
    enum: Gender,
    description: 'Género',
  })
  gender?: string;
}
