import { PersonEmbeddedDto } from 'src/modules/persons/dto/person-response.dto';
import { Gender } from 'src/common/enums/gender.enum';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class NaturalPersonResponseDto {
  @ApiProperty({ type: PersonEmbeddedDto })
  @Expose()
  @Type(() => PersonEmbeddedDto)
  readonly person: PersonEmbeddedDto;

  @ApiProperty({ example: 99 })
  @Expose()
  readonly dni: string;

  @ApiProperty()
  @Expose()
  readonly birthdate: Date;

  @ApiProperty({
    example: Gender.FEMALE,
    enum: Gender,
    description: 'Género',
  })
  @Expose()
  readonly gender: string;
}

export class NaturalPersonEmbeddedDto extends OmitType(
  NaturalPersonResponseDto,
  ['person'] as const,
) {}
