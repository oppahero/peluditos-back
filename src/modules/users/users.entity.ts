import { Exclude } from 'class-transformer';
import { UserRoles } from 'src/common/enums/rol.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  users_id: number;

  @Column({
    length: 10,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 100, // Asegúrate de que sea lo suficientemente largo para el hash de Bcrypt (aprox. 60-70 caracteres)
    select: false,
  })
  @Exclude()
  password: string;

  @Column({
    type: 'enum', // 👈 Indica a TypeORM que use el tipo ENUM de la base de datos
    enum: UserRoles, // 👈 Pasa el enum de TypeScript
    default: UserRoles.VETERINARIO,
  })
  rol: UserRoles;
}
