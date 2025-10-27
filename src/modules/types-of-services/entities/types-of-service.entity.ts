import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Column } from 'typeorm/browser';

@Entity()
export class TypesOfService {
  @PrimaryGeneratedColumn()
  types_of_services_id: number;

  @Column({ length: 20, type: 'varchar' })
  description: string;

  @Column()
  price: number;

  @Column()
  medical_assistance: boolean;
}
