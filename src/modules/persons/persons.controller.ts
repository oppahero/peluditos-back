import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { PaginatedPersonsDto } from './dto/paginated-persons.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PersonsService } from './persons.service';
import {
  PersonResponseDto,
  PersonWithRelationsResponseDto,
} from './dto/person-response.dto';
import {
  Get,
  Param,
  Query,
  Delete,
  HttpCode,
  Controller,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiResponse,
  ApiOperation,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  ApiErrorType,
  buildApiErrorResponse,
} from 'src/common/enums/api-error.types';

@ApiTags('Persons')
@Controller('persons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  /**
   *
   * @returns {SuccessResponseDto<PaginatedPersonsDto>} Devuelve una lista de personas según parámetros de paginación
   * @param {PaginationDto} paginationDto Lista de parámetros para filtrar
   */
  @Get()
  @ApiOperation({ summary: 'Obtener lista de Personas' })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<PaginatedPersonsDto>,
    example: {
      success: true,
      data: {
        items: [
          {
            persons_id: 3,
            name: 'Paola López',
            phone: '04121939372',
            email: 'paola@gmail.com',
            address: 'Alta Vista',
            taxpayer_type: 'V',
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

  /**
   *
   * @returns {SuccessResponseDto<PersonWithRelationsResponseDto>} Devuelve Persona (con extensión) dado el Id
   * @param {number} personId Id de la persona
   */
  @Get('detail/:personId')
  @ApiOperation({
    summary: 'Obtener datos completos del la persona dado el id',
  })
  @ApiParam({
    name: 'personId',
    type: Number,
    required: true,
    description: 'ID de la persona',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<PersonWithRelationsResponseDto>,
    example: {
      success: true,
      data: {
        persons_id: 29,
        name: 'Paola López',
        phone: '04121939372',
        email: 'paola@gmail.com',
        address: 'Alta Vista',
        taxpayer_type: 'V',
        naturalPerson: {
          dni: '25040204',
          birthdate: '1995-11-15',
          gender: 'F',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/persons/detail/{personId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Persona con ID 10 no encontrado',
    ),
  })
  async findByIdIncludingExtensions(
    @Param('personId') personId: number,
  ): Promise<SuccessResponseDto<PersonWithRelationsResponseDto>> {
    const res = await this.personsService.findByIdIncludingExtensions(personId);
    return new SuccessResponseDto<PersonWithRelationsResponseDto>({
      data: res,
    });
  }

  /**
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
