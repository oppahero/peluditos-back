import { AnimalsService } from './animals.service';
import { AnimalDto } from './dto/animal.dto';
import { AuthGuard } from '@nestjs/passport';
import { Animals } from './animals.entity';
import express from 'express';
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

// @UseGuards(AuthGuard('jwt'))
@Controller('animals')
export class AnimalsController {
  constructor(private animalsService: AnimalsService) {}

  @Get()
  findAll(@Req() request: express.Request): Promise<Animals[]> {
    return this.animalsService.findAll(request.query);
  }

  @Get(':animalId')
  findById(@Param('animalId') animalId: number): Promise<Animals | null> {
    return this.animalsService.findById(animalId) ?? [];
  }

  @Post()
  createAnimal(@Body() newAnimal: AnimalDto): Promise<Animals> {
    return this.animalsService.create(newAnimal);
  }

  @Put(':animalId')
  updateAnimal(
    @Param('animalId') animalId: number,
    @Body() newAnimal: AnimalDto,
  ): Promise<Animals> {
    return this.animalsService.update(animalId, newAnimal);
  }

  @Delete(':animalId')
  deleteAnimal(@Param('animalId') animalId: number): Promise<Animals> {
    return this.animalsService.delete(animalId);
  }
}
