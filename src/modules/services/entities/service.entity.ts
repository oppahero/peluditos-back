import { User } from 'src/modules/users/entities/user.entity';
import { Pet } from 'src/modules/pets/entities/pet.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  services_id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column('varchar', {
    length: 30,
    nullable: true,
  })
  observation?: string | null;

  @Column('decimal', { precision: 6, scale: 2 }) total_amount: number;

  @ManyToOne(() => Pet, (pet) => pet.pets_id)
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(() => User, (user) => user.users_id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
