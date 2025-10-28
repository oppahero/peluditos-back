import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TypesOfTaxpayer } from 'src/common/enums/types-of-taxpayer.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  @ApiProperty({ example: 'Paola López' })
  name: string;

  @IsString()
  @MaxLength(11)
  @IsNotEmpty()
  @ApiProperty({ example: '04121939372' })
  phone: string;

  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  @ApiProperty({ example: 'paola@gmail.com' })
  email: string;

  @IsString()
  @MaxLength(15)
  @ApiProperty({ example: 'Alta Vista' })
  address: string;

  @IsEnum(TypesOfTaxpayer)
  @IsNotEmpty()
  @ApiProperty({ example: TypesOfTaxpayer.INDIVIDUAL })
  taxpayer_type: TypesOfTaxpayer;
}
