import { CreateUpdateAnimalDto } from './dto/create-update-animal.dto';
import { PaginatedAnimalsDto } from './dto/paginated-animals.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AnimalResponseDto } from './dto/animals-response.dto';
import { AnimalsService } from './animals.service';
import {
  ApiBody,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Query,
  Delete,
  Controller,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiErrorType,
  buildApiErrorResponse,
} from 'src/common/enums/api-error.types';

@ApiTags('Animals')
@Controller('animals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class AnimalsController {
  constructor(private animalsService: AnimalsService) {}

  /**
   *
   * @returns {PaginatedAnimalsDto} Devuelve una lista de Animales según parámetros de paginación
   * @param {PaginationDto} paginationDto Lista de parámetros para filtrar
   */
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Obtener lista de Animales' })
  @ApiResponse({
    status: 200,
    type: PaginatedAnimalsDto,
    isArray: true,
    example: [
      {
        animals_id: 1,
        type: 'Perro',
      },
    ],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() paginationDto: PaginationDto): Promise<PaginatedAnimalsDto> {
    return this.animalsService.findAll(paginationDto);
  }

  /**
   *
   * @returns {AnimalResponseDto} Devuelve Animal dado el Id
   * @param {number} animalId Id del Animal
   */
  @Get(':animalId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Obtener Animal dado el id' })
  @ApiParam({
    name: 'animalId',
    type: Number,
    required: true,
    description: 'ID del Animal',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    type: AnimalResponseDto,
    example: {
      animals_id: 1,
      type: 'Perro',
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/animals/{animalId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Animal con ID 10 no encontrado',
    ),
  })
  findById(
    @Param('animalId') animalId: number,
  ): Promise<AnimalResponseDto | null> {
    return this.animalsService.findById(animalId);
  }

  /**
   *
   * @returns {AnimalResponseDto} Devuelve Animal creado
   * @param {CreateUpdateAnimalDto} newAnimal Animal a crear
   */
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Registra nuevo animal' })
  @ApiBody({ type: CreateUpdateAnimalDto })
  @ApiResponse({
    status: 200,
    type: AnimalResponseDto,
    example: {
      animals_id: 1,
      type: 'Perro',
    },
  })
  @ApiConflictResponse({
    example: buildApiErrorResponse(
      409,
      'v1/animals',
      ApiErrorType.CONFLICT,
      'El animal (Perro) ya existe',
    ),
  })
  createAnimal(
    @Body() newAnimal: CreateUpdateAnimalDto,
  ): Promise<AnimalResponseDto> {
    return this.animalsService.create(newAnimal);
  }

  /**
   *
   * @returns {AnimalResponseDto} Devuelve Animal modificado
   * @param {CreateUpdateAnimalDto} newAnimal Animal a modificar
   */
  @Put(':animalId')
  @ApiOperation({ summary: 'Modificar animal' })
  @ApiParam({
    name: 'animalId',
    type: Number,
    required: true,
    description: 'ID del animal',
    example: 1,
  })
  @ApiBody({ type: CreateUpdateAnimalDto })
  @ApiResponse({
    status: 200,
    type: AnimalResponseDto,
    example: {
      animals_id: 1,
      type: 'Perro',
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/animals/{animalId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Animal con ID 10 no encontrado',
    ),
  })
  @ApiConflictResponse({
    example: buildApiErrorResponse(
      409,
      'v1/animals/{animalId}',
      ApiErrorType.CONFLICT,
      'Ya existe un animal con ese tipo (Perro)',
    ),
  })
  updateAnimal(
    @Param('animalId') animalId: number,
    @Body() newAnimal: CreateUpdateAnimalDto,
  ): Promise<AnimalResponseDto> {
    return this.animalsService.update(animalId, newAnimal);
  }

  /**
   *
   * @returns {AnimalResponseDto}
   * @param {number} animalId Id del Animal a eliminar
   */
  @Delete(':animalId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar animal' })
  @ApiParam({
    name: 'animalId',
    type: Number,
    required: true,
    description: 'ID del animal',
    example: 10,
  })
  deleteAnimal(@Param('animalId') animalId: number): Promise<any> {
    return this.animalsService.delete(animalId);
  }
}
