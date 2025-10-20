import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Animals {
  @PrimaryGeneratedColumn()
  animals_id: number;

  @Column({
    length: 10,
  })
  type: string;
}
