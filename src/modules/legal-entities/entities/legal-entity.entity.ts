import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Person } from 'src/modules/persons/entities/person.entity';
import { IsString } from 'class-validator';

@Entity('legal_entities')
export class LegalEntity {
  @PrimaryColumn()
  person_id: number;

  @OneToOne(() => Person, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @Column({
    length: 10,
  })
  @IsString()
  rif: string;
}
