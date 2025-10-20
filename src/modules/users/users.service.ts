import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from './dto/users.dto';
import { createHash } from 'src/common/create-hash';
import { Injectable } from '@nestjs/common';
import { Users } from './users.entity';
import { Repository } from 'typeorm';

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
    return plainToInstance(UserResponseDto, users);
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const user: Users | null = await this.findUserEntityById(id);

    if (!user) return null;

    return plainToInstance(UserResponseDto, user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const password = await createHash(createUserDto.password);

    const newUser = this.usersRepository.create({
      username: createUserDto.username,
      rol: createUserDto.rol,
      password: password,
    });

    const savedUser = await this.usersRepository.save(newUser);

    return plainToInstance(UserResponseDto, savedUser);
  }

  async update(id: number, user: UpdateUserDto): Promise<UserResponseDto> {
    const toUpdate = await this.findUserEntityById(id);

    if (!toUpdate) throw new Error('Usuario no encontrado');

    if (user.password) toUpdate.password = await createHash(user.password);

    const { password, ...savedUser } = await this.usersRepository.save({
      ...toUpdate,
      ...user,
    });

    return plainToInstance(UserResponseDto, savedUser);
  }

  async delete(userId: number): Promise<any> {
    return await this.usersRepository.delete({ users_id: userId });
  }
}
