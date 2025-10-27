import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';

export class CreateTypeOfServiceDto {
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  @ApiProperty({ example: 'Consulta Veterinaria' })
  description: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({ example: 20 })
  price: number;

  @IsBoolean()
  @ApiProperty({ example: true })
  medical_assistance: boolean;
}
