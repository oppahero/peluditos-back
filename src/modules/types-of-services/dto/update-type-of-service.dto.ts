import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTypeOfServiceDto } from './create-type-of-service.dto';
import { IsBoolean, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class UpdateTypesOfServiceDto extends PartialType(
  CreateTypeOfServiceDto,
) {
  @IsString()
  @MaxLength(20)
  @ApiProperty({ example: 'Consulta Veterinaria' })
  description?: string;

  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 20 })
  price?: number;

  @IsBoolean()
  @ApiProperty({ example: true })
  medical_assistance?: boolean;
}
