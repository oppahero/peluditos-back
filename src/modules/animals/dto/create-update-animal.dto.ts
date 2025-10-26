import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUpdateAnimalDto {
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  @ApiProperty({ example: 'Perro' })
  type: string;
}
