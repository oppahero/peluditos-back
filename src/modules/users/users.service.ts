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
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import {
  throwIfNoEffect,
  throwIfNotFound,
} from 'src/helpers/throw-if-not-found.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  private async findUserEntityById(id: number): Promise<Users | null> {
    return await this.usersRepository.findOne({
      where: { users_id: id },
    });
  }

  async findByUsername(username: string): Promise<Users | null> {
    return await this.usersRepository.findOne({
      where: { username },
      select: ['users_id', 'username', 'password'],
    });
  }

  async findAll({
    page = 1,
    limit = 10,
  }: PaginationDto): Promise<PaginatedUsersDto> {
    const [data, total] = await this.usersRepository.findAndCount({
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
    let user: any = await this.findUserEntityById(id);

    if (user) user = plainToInstance(UserResponseDto, user);

    return throwIfNotFound(user, 'Usuario', id);
  }

  async create(newUser: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.findByUsername(newUser.username);

    if (existing)
      throw new ConflictException(`El usuario (${newUser.username}) ya existe`);

    const passworHash = await createHash(newUser.password);

    const { password, ...savedUser } = await this.usersRepository.save({
      username: newUser.username,
      rol: newUser.rol,
      password: passworHash,
    });

    return plainToInstance(UserResponseDto, savedUser);
  }

  async update(id: number, user: UpdateUserDto): Promise<UserResponseDto> {
    const toUpdate = await this.findUserEntityById(id);

    if (!toUpdate) throwIfNotFound(toUpdate, 'Usuario', id);

    if (toUpdate && user.password)
      user.password = await createHash(user.password);

    return await handleDatabaseError(
      async () => {
        const { password, ...savedUser } = await this.usersRepository.save({
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
    const res = await this.usersRepository.delete({ users_id: id });
    throwIfNoEffect(res, 'Usuario', id);
  }
}
