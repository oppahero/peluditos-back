import { PersonResponseDto } from 'src/modules/persons/dto/person-response.dto';
import { BreedResponseDto } from 'src/modules/breeds/dto/breed-response.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PetResponseDto {
  @ApiProperty({ example: 10 })
  @Expose()
  readonly pets_id: number;

  @ApiProperty({ example: 'Nori' })
  @Expose()
  readonly pet_name: string;

  @ApiProperty({ example: '2025-11-01' })
  @Expose()
  readonly birthdate: Date;

  @ApiProperty({ example: 4.8 })
  @Expose()
  readonly weight: number;

  @ApiProperty({ type: PersonResponseDto })
  @Expose()
  @Type(() => PersonResponseDto)
  readonly person: PersonResponseDto;

  @ApiProperty({ type: BreedResponseDto })
  @Expose()
  @Type(() => BreedResponseDto)
  readonly breed: BreedResponseDto;
}
