import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Breed } from 'src/modules/breeds/entities/breed.entity';

@Entity('animals')
export class Animal {
  @PrimaryGeneratedColumn()
  animals_id: number;

  @Column({
    length: 10,
    unique: true,
  })
  type: string;

  @OneToMany(() => Breed, (breed) => breed.animal)
  breeds: Breed[];
}
