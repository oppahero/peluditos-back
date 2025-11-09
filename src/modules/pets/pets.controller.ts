import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedPetsDto } from './dto/paginated-pets.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsService } from './pets.service';
import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  Query,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { PetResponseDto } from './dto/pet-response.dto';
import {
  ApiErrorType,
  buildApiErrorResponse,
} from 'src/common/enums/api-error.types';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  /**
   *
   * @returns {SuccessResponseDto<PaginatedPetsDto>} Devuelve una lista de mascotas según parámetros de paginación
   * @param {PaginationDto} paginationDto Lista de parámetros para filtrar
   */
  @Get()
  @ApiOperation({ summary: 'Obtener lista de Mascotas' })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<PaginatedPetsDto>,
    example: {
      success: true,
      data: {
        items: [
          {
            pets_id: 1,
            breed: {
              breeds_id: 5,
              breed: 'Poodle',
              animal_id: 33,
            },
            person: {
              persons_id: 32,
              name: 'Paola López',
              phone: '04121939372',
              email: 'paola@gmail.com',
              address: 'Alta Vista',
              taxpayer_type: 'V',
            },
            pet_name: 'Doki',
            birthdate: '2008-02-28T04:30:00.000Z',
            weight: 5,
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
  ): Promise<SuccessResponseDto<PaginatedPetsDto>> {
    const res = await this.petsService.findAll(paginationDto);
    return new SuccessResponseDto({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<PetResponseDto>} Devuelve Mascota dado el Id
   * @param {number} petId Id de la mascota
   */
  @Get(':petId')
  @ApiOperation({ summary: 'Obtener Mascota dado el id' })
  @ApiParam({
    name: 'petId',
    type: Number,
    required: true,
    description: 'ID de la mascota',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<PetResponseDto>,
    example: {
      success: true,
      data: {
        pets_id: 1,
        breed: {
          breeds_id: 5,
          breed: 'Poodle',
          animal_id: 33,
        },
        person: {
          persons_id: 32,
          name: 'Paola López',
          phone: '04121939372',
          email: 'paola@gmail.com',
          address: 'Alta Vista',
          taxpayer_type: 'V',
        },
        pet_name: 'Doki',
        birthdate: '2008-02-28T04:30:00.000Z',
        weight: 5,
      },
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/pets/{petId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Mascota con ID 10 no encontrado',
    ),
  })
  async findById(
    @Param('petId') petId: number,
  ): Promise<SuccessResponseDto<PetResponseDto>> {
    const res = await this.petsService.findById(petId);
    return new SuccessResponseDto({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<PetResponseDto>} Devuelve Animal creado
   * @param {CreatePetDto} newPet Empleado a crear
   */
  @Post()
  @ApiOperation({ summary: 'Registra nueva mascota' })
  @ApiBody({ type: CreatePetDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto<PetResponseDto>,
    example: {
      message: 'Mascota registrada exitosamente',
      data: {
        pets_id: 2,
        breed: {
          breeds_id: 5,
          breed: 'Poodle',
          animal_id: 33,
        },
        person: {
          persons_id: 32,
          name: 'Paola López',
          phone: '04121939372',
          email: 'paola@gmail.com',
          address: 'Alta Vista',
          taxpayer_type: 'V',
        },
        pet_name: 'Yumi',
        birthdate: '2011-01-27',
        weight: 4,
      },
    },
  })
  @ApiConflictResponse({
    example: buildApiErrorResponse(
      409,
      'v1/pets',
      ApiErrorType.CONFLICT,
      'Persona con ID 36 no encontrado',
    ),
  })
  async create(
    @Body() newPet: CreatePetDto,
  ): Promise<SuccessResponseDto<PetResponseDto>> {
    const res = await this.petsService.create(newPet);
    return new SuccessResponseDto({
      data: res,
      message: 'Mascota registrada exitosamente',
    });
  }

  /**
   *
   * @returns {SuccessResponseDto<PetResponseDto>} Devuelve Mascota modificada
   * @param {UpdatePetDto} newPet empleado a modificar
   */
  @Patch(':petId')
  @ApiOperation({ summary: 'Modificar mascota' })
  @ApiParam({
    name: 'petId',
    type: Number,
    required: true,
    description: 'ID de la mascota',
    example: 10,
  })
  @ApiBody({ type: UpdatePetDto })
  async update(
    @Param('petId') petId: number,
    @Body() newPet: UpdatePetDto,
  ): Promise<SuccessResponseDto<PetResponseDto>> {
    const res = await this.petsService.update(petId, newPet);
    return new SuccessResponseDto({
      data: res,
      message: 'Mascota actualizada exitosamente',
    });
  }

  /**
   * @param {number} petId Id de la mascota a eliminar
   */
  @Delete(':petId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar mascota' })
  @ApiParam({
    name: 'petId',
    type: Number,
    required: true,
    description: 'ID de la mascota',
    example: 10,
  })
  delete(@Param('petId') petId: number) {
    return this.petsService.delete(petId);
  }
}
