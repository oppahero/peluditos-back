import { PersonEmbeddedDto } from 'src/modules/persons/dto/person-response.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LegalEntityResponseDto {
  @ApiProperty({ example: 10 })
  @Expose()
  readonly person_id: number;

  @ApiProperty({ type: PersonEmbeddedDto })
  @Expose()
  @Type(() => PersonEmbeddedDto)
  readonly person: PersonEmbeddedDto;

  @ApiProperty({ example: 10 })
  @Expose()
  readonly rif: string;
}
