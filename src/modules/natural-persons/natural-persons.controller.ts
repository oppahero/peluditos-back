import { PaginatedNaturalPersonsDto } from './dto/paginated-natural-persons.dto';
import { NaturalPersonResponseDto } from './dto/natural-person-response.dto';
import { UpdateNaturalPersonDto } from './dto/update-natural-person.dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { CreateNaturalPersonDto } from './dto/create-natural-person.dto';
import { NaturalPersonsService } from './natural-persons.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  Get,
  Post,
  Body,
  Query,
  Param,
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
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  ApiErrorType,
  buildApiErrorResponse,
} from 'src/common/enums/api-error.types';

@ApiTags('Natural Persons')
@Controller('natural-persons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class NaturalPersonsController {
  constructor(private naturalPersonsService: NaturalPersonsService) {}

  /**
   *
   * @returns {SuccessResponseDto<PaginatedNaturalPersonsDto>} Devuelve una lista de Personas Naturales
   * @param {Request} request Lista de parámetros para filtrar
   */
  @Get()
  @ApiOperation({ summary: 'Obtener lista de Personas Naturales' })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<PaginatedNaturalPersonsDto>,
    example: {
      success: true,
      data: {
        items: [
          {
            person_id: 3,
            person: {
              persons_id: 3,
              name: 'Paola López',
              phone: '04121939372',
              email: 'paola@gmail.com',
              address: 'Alta Vista',
              taxpayer_type: 'V',
            },
            dni: '25040204',
            birthdate: '1995-11-15',
            gender: 'M',
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
  ): Promise<SuccessResponseDto<PaginatedNaturalPersonsDto>> {
    const res = await this.naturalPersonsService.findAll(paginationDto);
    return new SuccessResponseDto<PaginatedNaturalPersonsDto>({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<NaturalPersonResponseDto>} Devuelve datos de la persona dado el Id
   * @param {number} personId Id de la persona
   */
  @Get(':personId')
  @ApiOperation({ summary: 'Obtener datos de la persona dado el id' })
  @ApiParam({
    name: 'personId',
    type: Number,
    required: true,
    description: 'ID del la persona',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<NaturalPersonResponseDto>,
    example: {
      success: true,
      data: {
        dni: '25040204',
        birthdate: '1995-11-15',
        gender: 'F',
        person_id: 3,
      },
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/users/{usersId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Persona Natural con ID 10 no encontrado',
    ),
  })
  async findById(
    @Param('personId') personId: number,
  ): Promise<SuccessResponseDto<NaturalPersonResponseDto>> {
    const res = await this.naturalPersonsService.findById(personId);
    return new SuccessResponseDto<NaturalPersonResponseDto>({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<NaturalPersonResponseDto>} Devuelve Persona Natural creada
   * @param {CreateNaturalPersonDto} newPerson Persona a crear
   */
  @Post()
  @ApiOperation({ summary: 'Registra nueva persona natural' })
  @ApiBody({ type: CreateNaturalPersonDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto<NaturalPersonResponseDto>,
    example: {
      message: 'Persona Natural creada exitosamente',
      data: {
        person: {
          name: 'Paola López',
          phone: '04121939372',
          email: 'paola@gmail.com',
          address: 'Alta Vista',
          taxpayer_type: 'V',
          persons_id: 6,
        },
        dni: '4035328',
        birthdate: '1965-12-04T00:00:00.000Z',
        gender: 'F',
        person_id: 6,
      },
    },
  })
  @ApiConflictResponse({
    example: buildApiErrorResponse(
      409,
      'v1/users',
      ApiErrorType.CONFLICT,
      'Existe una persona registrada con ese dni (25040204)',
    ),
  })
  async create(
    @Body() newPerson: CreateNaturalPersonDto,
  ): Promise<SuccessResponseDto<NaturalPersonResponseDto>> {
    const res = await this.naturalPersonsService.create(newPerson);
    return new SuccessResponseDto<NaturalPersonResponseDto>({
      data: res,
      message: 'Persona Natural creada exitosamente',
    });
  }

  /**
   *
   * @returns {SuccessResponseDto<NaturalPersonResponseDto>} Devuelve Persona natural modificada
   * @param {UpdateNaturalPersonDto} newPerson persona a modificar
   */
  @Patch(':personId')
  @ApiOperation({ summary: 'Modificar persona natural' })
  @ApiParam({
    name: 'personId',
    type: Number,
    required: true,
    description: 'ID de la persona',
    example: 10,
  })
  @ApiBody({ type: UpdateNaturalPersonDto })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/natural-persons/{personId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Persona Natural con ID 10 no encontrado',
    ),
  })
  @ApiConflictResponse({
    example: buildApiErrorResponse(
      409,
      'v1/natural-persons/{personId}',
      ApiErrorType.CONFLICT,
      'Ya existe una persona con ese dni (25040204)',
    ),
  })
  async update(
    @Param('personId') personId: number,
    @Body() newPerson: UpdateNaturalPersonDto,
  ): Promise<SuccessResponseDto<NaturalPersonResponseDto>> {
    const res = await this.naturalPersonsService.update(personId, newPerson);
    return new SuccessResponseDto<NaturalPersonResponseDto>({
      data: res,
      message: 'Persona natural actualizada exitosamente',
    });
  }

  /**
   * @param {number} personId Id de la persona a eliminar
   */
  @Delete(':personId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar persona natural' })
  @ApiParam({
    name: 'personId',
    type: Number,
    required: true,
    description: 'ID de la persona',
    example: 10,
  })
  delete(@Param('personId') personId: number) {
    return this.naturalPersonsService.delete(personId);
  }
}
