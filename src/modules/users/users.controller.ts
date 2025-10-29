import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserResponseDto } from './dto/users-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import {
  ApiBody,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import {
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
  Controller,
  HttpCode,
  Patch,
} from '@nestjs/common';
import {
  ApiErrorType,
  buildApiErrorResponse,
} from 'src/common/enums/api-error.types';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   *
   * @returns {SuccessResponseDto<PaginatedUsersDto>} Devuelve una lista de Usuarios
   * @param {Request} request Lista de parámetros para filtrar
   */
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Obtener lista de Usuarios' })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<PaginatedUsersDto>,
    example: {
      success: true,
      data: {
        items: [
          {
            users_id: 1,
            rol: 'Administrador',
            username: 'mlopez707',
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        lastPage: 1,
      },
    },
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedUsersDto>> {
    const res = await this.usersService.findAll(paginationDto);
    return new SuccessResponseDto<PaginatedUsersDto>({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<UserResponseDto>} Devuelve Usuario dado el Id
   * @param {number} userId Id del Usuario
   */
  @Get(':userId')
  @HttpCode(200)
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
    type: SuccessResponseDto<UserResponseDto>,
    example: {
      success: true,
      data: {
        users_id: 1,
        rol: 'Administrador',
        username: 'mlopez707',
      },
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/users/{usersId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Usuario con ID 10 no encontrado',
    ),
  })
  async findById(
    @Param('userId') userId: number,
  ): Promise<SuccessResponseDto<UserResponseDto>> {
    const res = await this.usersService.findById(userId);
    return new SuccessResponseDto<UserResponseDto>({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<UserResponseDto>} Devuelve Usuario creado
   * @param {CreateUserDto} newUser Usuario a crear
   */
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Registra nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto<UserResponseDto>,
    example: {
      success: true,
      data: {
        username: 'usurio20',
        password: 'contrasena',
        rol: 'Veterinario',
      },
      message: 'Usuario creado exitosamente',
    },
  })
  @ApiConflictResponse({
    example: buildApiErrorResponse(
      409,
      'v1/users',
      ApiErrorType.CONFLICT,
      'El usuario (user123) ya existe',
    ),
  })
  async create(
    @Body() newUser: CreateUserDto,
  ): Promise<SuccessResponseDto<UserResponseDto>> {
    const res = await this.usersService.create(newUser);
    return new SuccessResponseDto<UserResponseDto>({
      data: res,
      message: 'Usuario creado exitosamente',
    });
  }

  /**
   *
   * @returns {SuccessResponseDto<UserResponseDto>} Devuelve Animal modificado
   * @param {UpdateUserDto} newUser usuario a modificar
   */
  @Patch(':userId')
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
    type: SuccessResponseDto<UserResponseDto>,
    example: {
      success: true,
      data: {
        users_id: 1,
        rol: 'Administrador',
        username: 'mlopez707',
      },
      message: 'Usuario actualizado exitosamente',
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/users/{userId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'usuario con ID 10 no encontrado',
    ),
  })
  @ApiConflictResponse({
    example: buildApiErrorResponse(
      409,
      'v1/users/{userId}',
      ApiErrorType.CONFLICT,
      'Ya existe un usuario con ese username (user123)',
    ),
  })
  async update(
    @Param('userId') userId: number,
    @Body() newUser: UpdateUserDto,
  ): Promise<SuccessResponseDto<UserResponseDto>> {
    const res = await this.usersService.update(userId, newUser);
    return new SuccessResponseDto<UserResponseDto>({
      data: res,
      message: 'Usuario actualizado exitosamente',
    });
  }

  /**
   *
   * @returns {any}
   * @param {number} userId Id del usuario a eliminar
   */
  @Delete(':userId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiParam({
    name: 'userId',
    type: Number,
    required: true,
    description: 'ID del usuario',
    example: 10,
  })
  delete(@Param('userId') userId: number): Promise<any> {
    return this.usersService.delete(userId);
  }
}
