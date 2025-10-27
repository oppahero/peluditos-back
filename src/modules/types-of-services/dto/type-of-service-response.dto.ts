import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';

export class TypeOfServiceResponseDto {
  @ApiProperty({ example: 99 })
  readonly types_of_service_id: number;

  @IsString()
  @MaxLength(20)
  @ApiProperty({ example: 'Consulta Veterinaria' })
  readonly description: string;

  @IsNumber()
  @ApiProperty({ example: 50 })
  readonly price: number;

  @IsBoolean()
  @ApiProperty({ example: true })
  readonly medical_assistance: boolean;
}
