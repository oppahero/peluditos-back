import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from './dto/users.dto';
import { Injectable } from '@nestjs/common';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createHash } from 'src/common/create-hash';

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

  async findAll(): Promise<UserResponseDto[]> {
    const users: Users[] = await this.usersRepository.find();
    return plainToInstance(UserResponseDto, users) as UserResponseDto[];
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const user: Users | null = await this.findUserEntityById(id);

    if (!user) return null;

    return plainToInstance(UserResponseDto, user) as UserResponseDto;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const saltRounds = 10;
    const password = await createHash(createUserDto.password);

    const newUser = this.usersRepository.create({
      username: createUserDto.username,
      rol: createUserDto.rol,
      password: password,
    });

    const savedUser = await this.usersRepository.save(newUser);

    return plainToInstance(UserResponseDto, savedUser) as UserResponseDto;
  }

  async update(id: number, user: UpdateUserDto): Promise<UserResponseDto> {
    const toUpdate = await this.findUserEntityById(id);

    const updated = {
      ...toUpdate,
      ...user,
    };

    const savedUser = await this.usersRepository.save(updated);

    return plainToInstance(UserResponseDto, savedUser) as UserResponseDto;
  }

  async delete(userId: number): Promise<any> {
    return await this.usersRepository.delete({ users_id: userId });
  }
}
