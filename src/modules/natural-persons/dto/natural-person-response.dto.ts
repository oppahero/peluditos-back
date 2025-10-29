import { PersonResponseDto } from 'src/modules/persons/dto/person-response.dto';
import { Gender } from 'src/common/enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';

export class NaturalPersonResponseDto {
  @ApiProperty({ type: PersonResponseDto })
  readonly person: PersonResponseDto;

  @ApiProperty({ example: 99 })
  readonly dni: string;

  @ApiProperty()
  readonly birthdate: Date;

  @ApiProperty({
    example: Gender.FEMALE,
    enum: Gender,
    description: 'Género',
  })
  readonly gender: string;
}
