import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  //   @Req() request: express.Request  request.query
  @Get()
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  findById(@Param('userId') userId: number): Promise<UserResponseDto | null> {
    return this.usersService.findById(userId) ?? [];
  }

  @Post()
  createUser(@Body() newUser: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(newUser);
  }

  @Put(':userId')
  updateUser(
    @Param('userId') userId: number,
    @Body() newUser: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(userId, newUser);
  }

  @Delete(':userId')
  deleteUser(@Param('userId') userId: number): Promise<Users> {
    return this.usersService.delete(userId);
  }
}
