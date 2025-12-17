import { handleDatabaseError } from 'src/helpers/database-error-helper';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserResponseDto } from './dto/users-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { createHash } from 'src/common/create-hash';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  throwIfNoEffect,
  throwIfNotFound,
} from 'src/helpers/throw-if-not-found.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findBy(
    key: string,
    value: any,
    manager?: EntityManager,
  ): Promise<User | null> {
    const repo = manager ? manager.getRepository(User) : this.userRepository;

    return await repo.findOne({
      where: { [key]: value },
    });
  }

  async findEntityById(id: number, manager?: EntityManager): Promise<User> {
    const pet = await this.findBy('users_id', id, manager);
    return throwIfNotFound(pet, 'Usuario', id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username },
      select: ['users_id', 'username', 'password', 'rol'],
    });
  }

  async findAll({
    page = 1,
    limit = 10,
  }: PaginationDto): Promise<PaginatedUsersDto> {
    const [data, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { users_id: 'ASC' },
    });

    return {
      items: data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.findEntityById(id);
    return plainToInstance(UserResponseDto, user);
  }

  async create(newUser: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.findByUsername(newUser.username);

    if (existing)
      throw new ConflictException(`El usuario (${newUser.username}) ya existe`);

    const passworHash = await createHash(newUser.password);

    const { password, ...savedUser } = await this.userRepository.save({
      username: newUser.username,
      rol: newUser.rol,
      password: passworHash,
    });

    return plainToInstance(UserResponseDto, savedUser);
  }

  async update(id: number, user: UpdateUserDto): Promise<UserResponseDto> {
    const toUpdate = await this.findEntityById(id);

    if (!toUpdate) throwIfNotFound(toUpdate, 'Usuario', id);

    if (toUpdate && user.password)
      user.password = await createHash(user.password);

    return await handleDatabaseError(
      async () => {
        const { password, ...savedUser } = await this.userRepository.save({
          ...toUpdate,
          ...user,
        });

        return plainToInstance(UserResponseDto, savedUser);
      },
      {
        conflictMessage: `Ya existe un usuario con ese username (${user.username})`,
      },
    );
  }

  async delete(id: number) {
    const res = await this.userRepository.delete({ users_id: id });
    throwIfNoEffect(res, 'Usuario', id);
  }
}
