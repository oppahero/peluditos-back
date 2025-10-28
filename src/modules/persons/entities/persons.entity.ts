import { IsEmail } from 'class-validator';
import { TypesOfTaxpayer } from 'src/common/enums/types-of-taxpayer.enum';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
