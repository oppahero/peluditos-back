import { TypesOfService } from 'src/modules/types-of-services/entities/type-of-service.entity';
import { Employee } from 'src/modules/employees/entities/employee.entity';
import { Service } from 'src/modules/services/entities/service.entity';
import {
  Entity,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('service_details')
export class ServiceDetail {
  @PrimaryGeneratedColumn()
  service_details_id: number;

  @DeleteDateColumn()
  deleted_at?: Date;

  @ManyToOne(() => Service, (service) => service.details)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ManyToOne(() => TypesOfService, (type) => type.types_of_service_id)
  @JoinColumn({ name: 'type_of_service_id' })
  type: TypesOfService;

  @ManyToOne(() => Employee, (employee) => employee.person_id)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
