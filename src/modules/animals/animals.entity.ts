import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Animals {
  @PrimaryGeneratedColumn()
  animals_id: number;

  @Column()
  type: string;
}
