import { NaturalPerson } from 'src/modules/natural-persons/entities/natural-person.entity';
import { TypesOfTaxpayer } from 'src/common/enums/types-of-taxpayer.enum';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail } from 'class-validator';
import { LegalEntity } from 'src/modules/legal-entities/entities/legal-entity.entity';

@Entity('persons')
export class Person {
  @PrimaryGeneratedColumn()
  persons_id: number;

  @Column({
    length: 30,
  })
  name: string;

  @Column({
    length: 11,
    unique: true,
  })
  phone: string;

  @Column({
    length: 15,
    unique: true,
  })
  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  email: string;

  @Column({
    length: 15,
  })
  address: string;

  @Column({
    type: 'enum',
    enum: TypesOfTaxpayer,
  })
  taxpayer_type: TypesOfTaxpayer;

  @OneToOne(() => NaturalPerson, (natural) => natural.person)
  naturalPerson: NaturalPerson;

  @OneToOne(() => LegalEntity, (entity) => entity.person)
  legalEntity: LegalEntity;
}
