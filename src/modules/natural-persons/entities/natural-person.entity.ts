import { Person } from 'src/modules/persons/entities/person.entity';
import {
  Column,
  Entity,
  Unique,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';

@Unique(['dni'])
@Entity('natural_persons')
export class NaturalPerson {
  @PrimaryColumn()
  person_id: number;

  @OneToOne(() => Person, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'person_id' })
  person: Person;

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
