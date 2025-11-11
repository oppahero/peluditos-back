import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateServiceDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ example: 2 })
  pet_id: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ example: 32 })
  user_id: number;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  @ApiProperty({ example: 'Perrito ansioso' })
  observation?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @ApiProperty({ example: 60.5 })
  total_amount: number;
}
