import { TypesOfTaxpayer } from 'src/common/enums/types-of-taxpayer.enum';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail } from 'class-validator';
import { NaturalPersons } from 'src/modules/natural-persons/entities/natural-persons.entity';

@Entity()
export class Persons {
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

  @OneToOne(() => NaturalPersons, (natural) => natural.person)
  naturalPerson: NaturalPersons;
}
