import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePersonDto } from './create-person.dto';

export class UpdatePersonDto extends PartialType(CreatePersonDto) {
  @IsString()
  @MaxLength(30)
  @ApiProperty({ example: 'Paola López' })
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(11)
  @ApiProperty({ example: '04121939372' })
  @IsOptional()
  phone?: string;

  @IsString()
  @MaxLength(15)
  @ApiProperty({ example: 'paola@gmail.com' })
  @IsOptional()
  email?: string;

  @IsString()
  @MaxLength(15)
  @ApiProperty({ example: 'Alta Vista' })
  @IsOptional()
  address?: string;
}
