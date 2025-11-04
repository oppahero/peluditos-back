import { PaginatedLegalEntitiesDto } from './dto/paginated-legal-entities.dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { LegalEntityResponseDto } from './dto/legal-entity-response.dto';
import { CreateLegalEntityDto } from './dto/create-legal-entity.dto';
import { UpdateLegalEntityDto } from './dto/update-legal-entity.dto';
import { LegalEntitiesService } from './legal-entities.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  Controller,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiOperation,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  ApiErrorType,
  buildApiErrorResponse,
} from 'src/common/enums/api-error.types';

@ApiTags('Legal Entities')
@Controller('legal-entities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class LegalEntitiesController {
  constructor(private readonly legalEntitiesService: LegalEntitiesService) {}

  /**
   *
   * @returns {SuccessResponseDto<PaginatedLegalEntitiesDto>} Devuelve una lista de Personas jurídicas
   * @param {Request} request Lista de parámetros para filtrar
   */
  @Get()
  @ApiOperation({ summary: 'Obtener lista de Personas Jurídicas' })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<PaginatedLegalEntitiesDto>,
    example: {
      success: true,
      data: {
        items: [
          {
            person_id: 36,
            person: {
              name: 'Inversiones GTP',
              phone: '02869621392',
              email: 'gtpp@gmail.com',
              address: 'Unare II',
              taxpayer_type: 'G',
            },
            rif: '12345678-9',
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
  ): Promise<SuccessResponseDto<PaginatedLegalEntitiesDto>> {
    const res = await this.legalEntitiesService.findAll(paginationDto);
    return new SuccessResponseDto({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<LegalEntityResponseDto>} Devuelve datos de la persona dado el Id
   * @param {number} personId Id de la persona
   */
  @Get(':personId')
  @ApiOperation({ summary: 'Obtener datos de la persona jurídica dado el id' })
  @ApiParam({
    name: 'personId',
    type: Number,
    required: true,
    description: 'ID del la persona',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<LegalEntityResponseDto>,
    example: {
      success: true,
      data: {
        person_id: 36,
        person: {
          name: 'Inversiones GTP',
          phone: '02869621392',
          email: 'gtpp@gmail.com',
          address: 'Unare II',
          taxpayer_type: 'G',
        },
        rif: '12345678-9',
      },
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/legal-entities/{personId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Persona Jurídica con ID 10 no encontrado',
    ),
  })
  async findById(
    @Param('personId') personId: number,
  ): Promise<SuccessResponseDto<LegalEntityResponseDto>> {
    const res = await this.legalEntitiesService.findById(personId);
    return new SuccessResponseDto({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<LegalEntityResponseDto>} Devuelve Persona Jurídica creada
   * @param {CreateLegalEntityDto} newLegalEntity Persona a crear
   */
  @Post()
  @ApiOperation({ summary: 'Registra nueva persona jurídica' })
  @ApiBody({ type: CreateLegalEntityDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto<LegalEntityResponseDto>,
    example: {
      message: 'Persona Natural creada exitosamente',
      data: {
        person_id: 37,
        person: {
          name: 'Comercio Animal',
          phone: '02869637410',
          email: 'inves@gmail.com',
          address: 'Altavista I',
          taxpayer_type: 'J',
        },
        rif: '12345678-9',
      },
    },
  })
  @ApiConflictResponse({
    example: buildApiErrorResponse(
      409,
      'v1/legal-entities',
      ApiErrorType.CONFLICT,
      'Existe una persona jurídica con ese rif (G12345678-9)',
    ),
  })
  async create(
    @Body() newLegalEntity: CreateLegalEntityDto,
  ): Promise<SuccessResponseDto<LegalEntityResponseDto>> {
    const res = await this.legalEntitiesService.create(newLegalEntity);
    return new SuccessResponseDto({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<LegalEntityResponseDto>} Devuelve Persona Jurídica modificada
   * @param {UpdateLegalEntityDto} newLegalEntity persona a modificar
   */
  @Patch(':personId')
  @ApiOperation({ summary: 'Actualizar persona jurídica' })
  @ApiParam({
    name: 'personId',
    type: Number,
    required: true,
    description: 'ID de la persona jurídica',
    example: 10,
  })
  @ApiBody({ type: UpdateLegalEntityDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<LegalEntityResponseDto>,
    example: {
      success: true,
      data: {
        person_id: 36,
        person: {
          name: 'Inversiones GTP',
          phone: '02869621392',
          email: 'gtpp@gmail.com',
          address: 'Unare I',
          taxpayer_type: 'G',
        },
        rif: '12345678-9',
      },
      message: 'Persona jurídica actualizada exitosamente',
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/legal-entities/{personId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Persona Jurídica con ID 10 no encontrado',
    ),
  })
  @ApiConflictResponse({
    example: buildApiErrorResponse(
      409,
      '/api/v1/legal-entities/{personId}',
      ApiErrorType.CONFLICT,
      'Ya existe una persona jurídica con ese rif (G12345678-9)',
    ),
  })
  async update(
    @Param('personId') personId: number,
    @Body() newLegalEntity: UpdateLegalEntityDto,
  ): Promise<SuccessResponseDto<LegalEntityResponseDto>> {
    const res = await this.legalEntitiesService.update(
      personId,
      newLegalEntity,
    );

    return new SuccessResponseDto({
      data: res,
      message: 'Persona jurídica actualizada exitosamente',
    });
  }

  @Delete(':personId')
  delete(@Param('personId') personId: number) {
    return this.legalEntitiesService.delete(personId);
  }
}
