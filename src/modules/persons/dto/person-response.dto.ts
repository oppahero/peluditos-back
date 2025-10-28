import { ApiProperty } from '@nestjs/swagger';
import { TypesOfTaxpayer } from 'src/common/enums/types-of-taxpayer.enum';

export class PersonResponseDto {
  @ApiProperty({ example: 99 })
  readonly persons_id: number;

  @ApiProperty({ example: 'Paola López' })
  readonly name: string;

  @ApiProperty({ example: '04121939372' })
  readonly phone: string;

  @ApiProperty({ example: 'paola@gmail.com' })
  readonly email: string;

  @ApiProperty({ example: 'Alta Vista' })
  readonly address: string;

  @ApiProperty({
    example: TypesOfTaxpayer.INDIVIDUAL,
    enum: TypesOfTaxpayer,
    description: 'Tipo de Contribuyente',
  })
  readonly taxpayer_type: TypesOfTaxpayer;
}
