import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Breeds } from '../breeds/entities/breeds.entity';

@Entity()
export class Animals {
  @PrimaryGeneratedColumn()
  animals_id: number;

  @Column({
    length: 10,
    unique: true,
  })
  type: string;

  @OneToMany(() => Breeds, (breed) => breed.animal)
  breeds: Breeds[];
}
