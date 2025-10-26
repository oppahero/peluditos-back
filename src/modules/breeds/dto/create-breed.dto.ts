import { ApiProperty } from '@nestjs/swagger';
import {
  Min,
  IsNumber,
  IsString,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateBreedDto {
  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  @ApiProperty({ example: 'Salchicha' })
  breed: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  animal_id: number;
}
