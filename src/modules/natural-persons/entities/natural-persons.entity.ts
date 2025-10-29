import { Persons } from 'src/modules/persons/entities/persons.entity';
import {
  Column,
  Entity,
  Unique,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';

@Unique(['dni'])
@Entity()
export class NaturalPersons {
  @PrimaryColumn()
  person_id: number;

  @OneToOne(() => Persons, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'person_id' })
  person: Persons;

  @Column({
    length: 9,
  })
  dni: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column({
    length: 1,
  })
  gender: string;
}
