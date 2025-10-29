import { Breeds } from 'src/modules/breeds/entities/breeds.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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
