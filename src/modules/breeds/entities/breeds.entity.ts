import { Animals } from 'src/modules/animals/entities/animals.entity';
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
export class Breeds {
  @PrimaryGeneratedColumn()
  breeds_id: number;

  @Column({ length: 15, type: 'varchar' })
  breed: string;

  @Column()
  animal_id: number;

  @ManyToOne(() => Animals, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'animal_id' })
  animal: Animals;
}
