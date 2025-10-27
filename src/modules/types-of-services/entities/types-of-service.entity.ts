import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TypesOfService {
  @PrimaryGeneratedColumn()
  types_of_services_id: number;

  @Column({ length: 20, type: 'varchar', unique: true })
  description: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  medical_assistance: boolean;
}
