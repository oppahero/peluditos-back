import { PaginatedTypesOfServicesDto } from './dto/paginated-types-of-services.dto';
import { TypeOfServiceResponseDto } from './dto/type-of-service-response.dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { CreateTypeOfServiceDto } from './dto/create-type-of-service.dto';
import { UpdateTypeOfServiceDto } from './dto/update-type-of-service.dto';
import { TypesOfServiceService } from './types-of-services.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
} from '@nestjs/common';
import {
  ApiErrorType,
  buildApiErrorResponse,
} from 'src/common/enums/api-error.types';

@ApiTags('TypesOfServices')
@Controller('types-of-services')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class TypesOfServicesController {
  constructor(private typesOfServiceService: TypesOfServiceService) {}

  /**
   *
   * @returns {SuccessResponseDto<PaginatedTypesOfServicesDto>} Devuelve lista de servicios según parámetros de paginación
   * @param {PaginationDto} paginationDto Lista de parámetros para filtrar
   */
  @Get()
  @ApiOperation({ summary: 'Obtener lista de tipos de Servicios' })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<PaginatedTypesOfServicesDto>,
    example: {
      success: true,
      data: {
        items: [
          {
            types_of_services_id: 1,
            description: 'Consulta Veterinaria',
            price: 20,
            medical_assistance: true,
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
  ): Promise<SuccessResponseDto<PaginatedTypesOfServicesDto>> {
    const res = await this.typesOfServiceService.findAll(paginationDto);
    return new SuccessResponseDto<PaginatedTypesOfServicesDto>({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<TypeOfServiceResponseDto>} Devuelve tipo de servicio dado el Id
   * @param {number} typeId Id de registro
   */
  @Get(':typeId')
  @ApiOperation({ summary: 'Obtener servicio por Id' })
  @ApiParam({
    name: 'typeId',
    type: Number,
    required: true,
    description: 'ID del tipo de servicio',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<TypeOfServiceResponseDto>,
    example: {
      success: true,
      data: {
        types_of_services_id: 1,
        description: 'Consulta Veterinaria',
        price: 20,
        medical_assistance: true,
      },
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/types-of-services/{typeId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Tipo de Servicio con ID 10 no encontrado',
    ),
  })
  async findById(
    @Param('typeId') typeId: number,
  ): Promise<SuccessResponseDto<TypeOfServiceResponseDto>> {
    const res = await this.typesOfServiceService.findById(typeId);
    return new SuccessResponseDto<TypeOfServiceResponseDto>({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<TypeOfServiceResponseDto>} Devuelve servicio creado
   * @param {CreateTypeOfServiceDto} newType tipo de servicio a registrar
   */
  @Post()
  @ApiOperation({ summary: 'Registra tipo de servicio' })
  @ApiBody({ type: CreateTypeOfServiceDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto<TypeOfServiceResponseDto>,
    example: {
      success: true,
      data: {
        description: 'Consulta Veterinaria',
        price: 20,
        medical_assistance: true,
        types_of_services_id: 1,
      },
      message: 'Se ha registrado el tipo de servicio exitosamente',
    },
  })
  @ApiConflictResponse({
    example: buildApiErrorResponse(
      409,
      'v1/types-of-services',
      ApiErrorType.CONFLICT,
      'Servicio (Consulta Veterinaria) ya se encuentra registrado',
    ),
  })
  async create(
    @Body() newType: CreateTypeOfServiceDto,
  ): Promise<SuccessResponseDto<TypeOfServiceResponseDto>> {
    const res = await this.typesOfServiceService.create(newType);
    return new SuccessResponseDto<TypeOfServiceResponseDto>({
      data: res,
      message: 'Se ha registrado el tipo de servicio exitosamente',
    });
  }

  /**
   *
   * @returns {SuccessResponseDto<TypeOfServiceResponseDto>} Devuelve servicio modificado
   * @param {UpdateTypeOfServiceDto} newType Registro a modificar
   */
  @Patch(':typeId')
  @ApiOperation({ summary: 'Modificar tipo de servicio' })
  @ApiParam({
    name: 'typeId',
    type: Number,
    required: true,
    description: 'ID del registro',
    example: 1,
  })
  @ApiBody({ type: UpdateTypeOfServiceDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<TypeOfServiceResponseDto>,
    example: {
      success: true,
      data: {
        types_of_services_id: 2,
        medical_assistance: false,
      },
      message: 'Tipo de servicio actualizado exitosamente',
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/types-of-services/{typeId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Tipo de Servicio con ID 10 no encontrado',
    ),
  })
  @ApiConflictResponse({
    example: buildApiErrorResponse(
      409,
      'v1/types-of-services/{typeId}',
      ApiErrorType.CONFLICT,
      'Ya existe una servicio con esa descripción (Consulta Veterinaria).',
    ),
  })
  async update(
    @Param('typeId') typeId: number,
    @Body() newType: UpdateTypeOfServiceDto,
  ): Promise<SuccessResponseDto<TypeOfServiceResponseDto>> {
    const res = await this.typesOfServiceService.update(typeId, newType);
    return new SuccessResponseDto<TypeOfServiceResponseDto>({
      data: res,
      message: 'Tipo de servicio actualizado exitosamente',
    });
  }

  /**
   * @param {number} typeId Id del registro
   */
  @Delete(':typeId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar tipo de servicio' })
  @ApiParam({
    name: 'typeId',
    type: Number,
    required: true,
    description: 'ID del registro',
    example: 10,
  })
  delete(@Param('typeId') typeId: number) {
    return this.typesOfServiceService.delete(typeId);
  }
}
