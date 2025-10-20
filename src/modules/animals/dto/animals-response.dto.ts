import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class AnimalResponseDto {
  @ApiProperty({ example: 99 })
  readonly animals_id: number;

  @IsString()
  @MaxLength(10)
  @ApiProperty({ example: 'Perro' })
  readonly type: string;
}
