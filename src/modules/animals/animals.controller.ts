import { CreateUpdateAnimalDto } from './dto/create-update-animal.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AnimalResponseDto } from './dto/animal.dto';
import { AnimalsService } from './animals.service';
import { Animals } from './animals.entity';
import express from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Get,
  Put,
  Req,
  Body,
  Post,
  Param,
  Delete,
  Controller,
  UseGuards,
} from '@nestjs/common';

@ApiTags('Animals')
@Controller('animals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class AnimalsController {
  constructor(private animalsService: AnimalsService) {}

  /**
   *
   * @returns {AnimalResponseDto[]} Devuelve una lista de Animales
   * @param {Request} request Lista de parámetros para filtrar
   */
  @Get()
  @ApiOperation({ summary: 'Obtener lista de Animales' })
  @ApiResponse({
    status: 200,
    type: AnimalResponseDto,
    isArray: true,
    example: [
      {
        animals_id: 1,
        type: 'Perro',
      },
    ],
  })
  findAll(@Req() request: express.Request): Promise<AnimalResponseDto[]> {
    return this.animalsService.findAll(request.query);
  }

  /**
   *
   * @returns {AnimalResponseDto} Devuelve Animal dado el Id
   * @param {number} animalId Id del Animal
   */
  @Get(':animalId')
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
  @ApiOperation({ summary: 'Registra nuevo animal' })
  @ApiBody({ type: CreateUpdateAnimalDto })
  @ApiResponse({
    status: 200,
    type: Animals,
    example: {
      animals_id: 1,
      type: 'Perro',
    },
  })
  createAnimal(
    @Body() newAnimal: CreateUpdateAnimalDto,
  ): Promise<AnimalResponseDto> {
    return this.animalsService.create(newAnimal);
  }

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
    type: Animals,
    example: {
      animals_id: 1,
      type: 'Perro',
    },
  })
  updateAnimal(
    @Param('animalId') animalId: number,
    @Body() newAnimal: CreateUpdateAnimalDto,
  ): Promise<AnimalResponseDto> {
    return this.animalsService.update(animalId, newAnimal);
  }

  @Delete(':animalId')
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
