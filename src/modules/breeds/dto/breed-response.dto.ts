import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class BreedResponseDto {
  @ApiProperty({ example: 99 })
  readonly breeds_id: number;

  @ApiProperty({ example: 5 })
  readonly animal_id: number;

  @IsString()
  @MaxLength(15)
  @ApiProperty({ example: 'Salchicha' })
  readonly breed: string;
}
