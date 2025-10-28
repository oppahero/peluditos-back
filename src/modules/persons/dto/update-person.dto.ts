import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePersonDto } from './create-person.dto';
import { IsString, MaxLength } from 'class-validator';

export class UpdatePersonDto extends PartialType(CreatePersonDto) {
  @IsString()
  @MaxLength(30)
  @ApiProperty({ example: 'Paola López' })
  name?: string;

  @IsString()
  @MaxLength(11)
  @ApiProperty({ example: '04121939372' })
  phone?: string;

  @IsString()
  @MaxLength(15)
  @ApiProperty({ example: 'paola@gmail.com' })
  email?: string;

  @IsString()
  @MaxLength(15)
  @ApiProperty({ example: 'Alta Vista' })
  address?: string;
}
