import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Animals {
  @ApiProperty({ example: 99 })
  @PrimaryGeneratedColumn()
  animals_id: number;

  @ApiProperty({ example: 'Perro' })
  @Column({
    length: 10,
  })
  type: string;
}
