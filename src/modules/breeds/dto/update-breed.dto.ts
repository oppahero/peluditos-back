import { IsOptional, IsString, MaxLength, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateBreedDto } from './create-breed.dto';

export class UpdateBreedDto extends PartialType(CreateBreedDto) {
  @IsOptional()
  @IsString()
  @MaxLength(15)
  @ApiPropertyOptional({ example: 'Salchicha' })
  breed?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 1 })
  animal_id?: number;
}
