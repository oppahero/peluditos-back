import { Animal } from 'src/modules/animals/entities/animal.entity';
import {
  Column,
  Entity,
  Unique,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('breeds')
@Unique(['breed', 'animal_id'])
export class Breed {
  @PrimaryGeneratedColumn()
  breeds_id: number;

  @Column({ length: 15, type: 'varchar' })
  breed: string;

  @Column()
  animal_id: number;

  @ManyToOne(() => Animal, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'animal_id' })
  animal: Animal;
}
