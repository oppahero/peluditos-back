import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/users-response.dto';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  Controller,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   *
   * @returns {PaginatedUsersDto} Devuelve una lista de Usuarios
   * @param {Request} request Lista de parámetros para filtrar
   */
  @Get()
  @ApiOperation({ summary: 'Obtener lista de Usuarios' })
  @ApiResponse({
    status: 200,
    type: PaginatedUsersDto,
    isArray: true,
    example: [
      {
        users_id: 1,
        rol: 'Administrador',
        username: 'mlopez707',
      },
    ],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() paginationDto: PaginationDto): Promise<PaginatedUsersDto> {
    return this.usersService.findAll(paginationDto);
  }

  /**
   *
   * @returns {UserResponseDto} Devuelve Usuario dado el Id
   * @param {number} userId Id del Usuario
   */
  @Get(':userId')
  @ApiOperation({ summary: 'Obtener usuario dado el id' })
  @ApiParam({
    name: 'userId',
    type: Number,
    required: true,
    description: 'ID del usuario',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    type: UserResponseDto,
    example: {
      users_id: 1,
      rol: 'Administrador',
      username: 'mlopez707',
    },
  })
  findById(@Param('userId') userId: number): Promise<UserResponseDto | null> {
    return this.usersService.findById(userId);
  }

  /**
   *
   * @returns {UserResponseDto} Devuelve Usuario creado
   * @param {CreateUserDto} newUser Usuario a crear
   */
  @Post()
  @ApiOperation({ summary: 'Registra nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    example: {
      username: 'usurio20',
      password: 'contrasena',
      rol: 'Veterinario',
    },
  })
  createUser(@Body() newUser: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(newUser);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Modificar usuario' })
  @ApiParam({
    name: 'userId',
    type: Number,
    required: true,
    description: 'ID del usuario',
    example: 10,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    type: UserResponseDto,
    example: {
      users_id: 1,
      rol: 'Administrador',
      username: 'mlopez707',
    },
  })
  updateUser(
    @Param('userId') userId: number,
    @Body() newUser: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(userId, newUser);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiParam({
    name: 'userId',
    type: Number,
    required: true,
    description: 'ID del usuario',
    example: 10,
  })
  deleteUser(@Param('userId') userId: number): Promise<Users> {
    return this.usersService.delete(userId);
  }
}
