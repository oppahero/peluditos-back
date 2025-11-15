import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('types_of_service')
export class TypesOfService {
  @PrimaryGeneratedColumn()
  types_of_service_id: number;

  @Column({ length: 30, type: 'varchar', unique: true })
  description: string;

  @Column('decimal', { precision: 6, scale: 2 })
  price: number;

  @Column({ nullable: true })
  medical_assistance: boolean;
}
