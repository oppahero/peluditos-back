import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { PaginatedPersonsDto } from './dto/paginated-persons.dto';
import { PersonResponseDto } from './dto/person-response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PersonsService } from './persons.service';
import { Persons } from './entities/persons.entity';
import {
  Get,
  Param,
  Query,
  Delete,
  HttpCode,
  Controller,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiResponse,
  ApiOperation,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  ApiErrorType,
  buildApiErrorResponse,
} from 'src/common/enums/api-error.types';

@ApiTags('Persons')
@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  /**
   *
   * @returns {SuccessResponseDto<PaginatedPersonsDto>} Devuelve una lista de personas según parámetros de paginación
   * @param {PaginationDto} paginationDto Lista de parámetros para filtrar
   */
  @Get()
  @ApiOperation({ summary: 'Obtener lista de Personas' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedPersonsDto>> {
    const res = await this.personsService.findAll(paginationDto);
    return new SuccessResponseDto<PaginatedPersonsDto>({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<PersonResponseDto>} Devuelve Persona dado el Id
   * @param {number} personId Id de la persona
   */
  @Get(':personId')
  @ApiOperation({ summary: 'Obtener Persona dado el id' })
  @ApiParam({
    name: 'personId',
    type: Number,
    required: true,
    description: 'ID de la persona',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<PersonResponseDto>,
    example: {
      success: true,
      data: {
        persons_id: 3,
        name: 'Paola López',
        phone: '04121939372',
        email: 'paola@gmail.com',
        address: 'Alta Vista',
        taxpayer_type: 'V',
      },
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/persons/{personId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Persona con ID 10 no encontrado',
    ),
  })
  async findById(
    @Param('personId') personId: number,
  ): Promise<SuccessResponseDto<PersonResponseDto>> {
    const res = await this.personsService.findById(personId);
    return new SuccessResponseDto<PersonResponseDto>({ data: res });
  }

  @Get('data/:personId')
  async findByIdIncludingExtensions(
    @Param('personId') personId: number,
  ): Promise<SuccessResponseDto<Persons>> {
    const res = await this.personsService.findByIdIncludingExtensions(personId);
    return new SuccessResponseDto<Persons>({ data: res });
  }

  /**
   *
   * @returns {any}
   * @param {number} personId Id de la persona a eliminar
   */
  @Delete(':personId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar persona' })
  @ApiParam({
    name: 'personId',
    type: Number,
    required: true,
    description: 'ID de la persona',
    example: 10,
  })
  delete(@Param('personId') personId: number) {
    return this.personsService.delete(personId);
  }
}
