import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTypeOfServiceDto } from './create-type-of-service.dto';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateTypeOfServiceDto extends PartialType(
  CreateTypeOfServiceDto,
) {
  @IsString()
  @MaxLength(20)
  @IsOptional()
  @ApiProperty({ example: 'Consulta Veterinaria' })
  description?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @ApiProperty({ example: 20 })
  price?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  medical_assistance?: boolean;
}
