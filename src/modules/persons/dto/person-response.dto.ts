import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { TypesOfTaxpayer } from 'src/common/enums/types-of-taxpayer.enum';
import { LegalEntityResponseDto } from 'src/modules/legal-entities/dto/legal-entity-response.dto';
import { NaturalPersonEmbeddedDto } from 'src/modules/natural-persons/dto/natural-person-response.dto';

export class PersonResponseDto {
  @ApiProperty({ example: 99 })
  @Expose()
  readonly persons_id: number;

  @ApiProperty({ example: 'Paola López' })
  @Expose()
  readonly name: string;

  @ApiProperty({ example: '04121939372' })
  @Expose()
  readonly phone: string;

  @ApiProperty({ example: 'paola@gmail.com' })
  @Expose()
  readonly email: string;

  @ApiProperty({ example: 'Alta Vista' })
  @Expose()
  readonly address: string;

  @ApiProperty({
    example: TypesOfTaxpayer.INDIVIDUAL,
    enum: TypesOfTaxpayer,
    description: 'Tipo de Contribuyente',
  })
  @Expose()
  readonly taxpayer_type: TypesOfTaxpayer;
}

export class PersonEmbeddedDto extends OmitType(PersonResponseDto, [
  'persons_id',
] as const) {}

export class PersonWithRelationsResponseDto extends PersonResponseDto {
  @ApiProperty({ type: NaturalPersonEmbeddedDto, required: false })
  @Type(() => NaturalPersonEmbeddedDto)
  @Expose()
  @Transform(({ value }) => (value == null ? undefined : value), {
    toClassOnly: true,
  })
  naturalPerson?: NaturalPersonEmbeddedDto;

  // @ApiProperty({ type: EmployeeEmbeddedDto, required: false })
  // @Type(() => EmployeeEmbeddedDto)
  // @Expose()
  // @Transform(({ value }) => (value == null ? undefined : value), {
  //   toPlainOnly: true,
  // })
  // employee?: EmployeeEmbeddedDto;

  @ApiProperty({ type: LegalEntityResponseDto, required: false })
  @Type(() => LegalEntityResponseDto)
  @Expose()
  @Transform(({ value }) => (value == null ? undefined : value), {
    toClassOnly: true,
  })
  legalEntity?: LegalEntityResponseDto;
}
