import { TypesOfTaxpayer } from 'src/common/enums/types-of-taxpayer.enum';
import { CreatePersonDto } from 'src/modules/persons/dto/create-person.dto';
import { Gender } from 'src/common/enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsString,
  MaxLength,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class CreateNaturalPersonDto {
  @ValidateNested()
  @Type(() => CreatePersonDto)
  @IsNotEmpty()
  @ApiProperty({
    example: {
      name: 'Paola López',
      phone: '04121939372',
      email: 'paola@gmail.com',
      address: 'Alta Vista',
      taxpayer_type: TypesOfTaxpayer.INDIVIDUAL,
    },
  })
  person: CreatePersonDto;

  @IsString()
  @MaxLength(9)
  @IsNotEmpty()
  @ApiProperty({ example: '25040204' })
  dni: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ example: new Date('11-15-1995') })
  birthdate: Date;

  @IsEnum(Gender, {
    message: 'El genero debe ser F o M',
  })
  @IsNotEmpty()
  @ApiProperty({
    example: Gender.FEMALE,
    enum: Gender,
    description: 'Género',
  })
  gender: string;
}
