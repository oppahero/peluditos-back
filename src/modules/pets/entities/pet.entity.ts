import { Breed } from 'src/modules/breeds/entities/breed.entity';
import { Person } from 'src/modules/persons/entities/person.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn()
  pets_id: number;

  @ManyToOne(() => Breed, (breed) => breed.breeds_id)
  @JoinColumn({ name: 'breed_id' })
  breed: Breed;

  @ManyToOne(() => Person, (person) => person.persons_id)
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @Column({
    length: 15,
  })
  pet_name: string;

  @Column()
  birthdate: Date;

  @Column('decimal', { precision: 5, scale: 2 }) weight: number;
}
