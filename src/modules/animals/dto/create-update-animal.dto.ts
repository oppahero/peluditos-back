import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateUpdateAnimalDto {
  @IsString()
  @MaxLength(10)
  @ApiProperty({ example: 'Perro' })
  type: string;
}
