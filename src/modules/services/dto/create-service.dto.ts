import { CreateServiceDetailDto } from 'src/modules/service-details/dto/create-service-detail.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsArray,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsOptional,
  IsPositive,
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
  @ApiProperty({ example: 'Perrito ansioso', required: false })
  observation?: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    example: [
      {
        type_of_service_id: 2,
        employee_id: 1,
      },
    ],
  })
  details: CreateServiceDetailDto[];
}
