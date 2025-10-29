import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { PaginatedBreedsDto } from './dto/paginated-breeds.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { BreedResponseDto } from './dto/breed-response.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { CreateBreedDto } from './dto/create-breed.dto';
import { BreedsService } from './breeds.service';
import {
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
} from '@nestjs/common';
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
  ApiErrorType,
  buildApiErrorResponse,
} from 'src/common/enums/api-error.types';

@ApiTags('Breeds')
@Controller('breeds')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class BreedsController {
  constructor(private breedsService: BreedsService) {}

  /**
   *
   * @returns {SuccessResponseDto<PaginatedBreedsDto>} Devuelve asociaciones entre animales y razas según parámetros de paginación
   * @param {PaginationDto} paginationDto Lista de parámetros para filtrar
   */
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Obtener lista de Asociaciones Animal/Razas' })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<PaginatedBreedsDto>,
    example: {
      success: true,
      data: {
        items: [
          {
            breeds_id: 1,
            breed: 'Poodle',
            animal_id: 1,
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
  ): Promise<SuccessResponseDto<PaginatedBreedsDto>> {
    const res = await this.breedsService.findAll(paginationDto);
    return new SuccessResponseDto<PaginatedBreedsDto>({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<BreedResponseDto>} Devuelve asociacion dado el Id
   * @param {number} breedId Id de registro
   */
  @Get(':breedId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Obtener Asociación Animal/Raza por Id' })
  @ApiParam({
    name: 'breedId',
    type: Number,
    required: true,
    description: 'ID del Registro de Asociación Animal/Raza',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<BreedResponseDto>,
    example: {
      success: true,
      data: {
        breeds_id: 1,
        breed: 'Poodle',
        animal_id: 1,
      },
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/breeds/{animalId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Raza con ID 10 no encontrado',
    ),
  })
  async findById(
    @Param('breedId') breedId: number,
  ): Promise<SuccessResponseDto<BreedResponseDto>> {
    const res = await this.breedsService.findById(breedId);
    return new SuccessResponseDto<BreedResponseDto>({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<BreedResponseDto>} Devuelve razas asociadas a un animal dado el Id
   * @param {number} animalId Id de registro
   */
  @Get('animal/:animalId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Obtener Razas asociadas a una animal, dado el Id' })
  @ApiParam({
    name: 'animalId',
    type: Number,
    required: true,
    description: 'ID del Animal',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<BreedResponseDto>,
    example: {
      success: true,
      data: [
        {
          breeds_id: 1,
          breed: 'Poodle',
          animal_id: 1,
        },
      ],
    },
  })
  async findByAnimalId(
    @Param('animalId') animalId: number,
  ): Promise<SuccessResponseDto<BreedResponseDto[]>> {
    const res = await this.breedsService.findByAnimalId(animalId);
    return new SuccessResponseDto<BreedResponseDto[]>({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<BreedsResponseDto>} Devuelve asociación creada
   * @param {CreateBreedDto} newBreed raza a asociar
   */
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Asocia raza a un animal' })
  @ApiBody({ type: CreateBreedDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto<BreedResponseDto>,
    example: {
      success: true,
      data: {
        breed: 'Poodle',
        animal_id: 1,
        breeds_id: 1,
      },
      message: 'Se ha asociado la raza exitosamente',
    },
  })
  @ApiConflictResponse({
    example: buildApiErrorResponse(
      409,
      'v1/animals',
      ApiErrorType.CONFLICT,
      'Raza (Poodle) ya se encuentra registrada y asociada a un animal',
    ),
  })
  async create(
    @Body() newBreed: CreateBreedDto,
  ): Promise<SuccessResponseDto<BreedResponseDto>> {
    const res = await this.breedsService.create(newBreed);
    return new SuccessResponseDto<BreedResponseDto>({
      data: res,
      message: 'Se ha asociado la raza exitosamente',
    });
  }

  /**
   *
   * @returns {SuccessResponseDto<BreedResponseDto>} Devuelve asociación modificada
   * @param {UpdateBreedDto} newBreed Registri a modificar
   */
  @Patch(':breedId')
  @ApiOperation({ summary: 'Modificar asociación Animal/Raza' })
  @ApiParam({
    name: 'breedId',
    type: Number,
    required: true,
    description: 'ID del registro',
    example: 1,
  })
  @ApiBody({ type: UpdateBreedDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<BreedResponseDto>,
    example: {
      success: true,
      data: {
        animals_id: 1,
        type: 'Perro',
      },
      message: 'Asociación actualizada exitosamente',
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/breeds/{breedId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Raza con ID 10 no encontrado',
    ),
  })
  @ApiConflictResponse({
    example: buildApiErrorResponse(
      409,
      'v1/breeds/{breedId}',
      ApiErrorType.CONFLICT,
      'Ya existe una raza con ese nombre (Poodle) para el animal seleccionado.',
    ),
  })
  async update(
    @Param('breedId') breedId: number,
    @Body() newBreed: UpdateBreedDto,
  ): Promise<SuccessResponseDto<BreedResponseDto>> {
    const res = await this.breedsService.update(breedId, newBreed);
    return new SuccessResponseDto<BreedResponseDto>({
      data: res,
      message: 'Asociación actualizada exitosamente',
    });
  }

  /**
   * @param {number} breedId Id del registro
   */
  @Delete(':breedId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar asociación Animal/Raza' })
  @ApiParam({
    name: 'breedId',
    type: Number,
    required: true,
    description: 'ID del registro',
    example: 10,
  })
  delete(@Param('breedId') breedId: number) {
    return this.breedsService.delete(breedId);
  }
}
