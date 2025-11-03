import { NaturalPerson } from 'src/modules/natural-persons/entities/natural-person.entity';
import { TypeOfEmployee } from 'src/common/enums/type-of-employee.enum';
import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryColumn()
  person_id: number;

  @OneToOne(() => NaturalPerson, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'person_id' })
  natural_person: NaturalPerson;

  @Column({
    type: 'enum',
    enum: TypeOfEmployee,
    default: TypeOfEmployee.VETERINARIAN,
  })
  type_of_employee: TypeOfEmployee;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
