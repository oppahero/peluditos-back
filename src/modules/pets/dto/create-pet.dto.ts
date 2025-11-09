import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class CreatePetDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  breedId: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 25 })
  personId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Olive' })
  pet_name: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2020-10-11' })
  birthdate: Date;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @ApiProperty({ example: 7.8 })
  weight: number;
}
