import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { PaginatedServicesDto } from './dto/paginated-services.dto';
import { ServiceResponseDto } from './dto/service-response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';
import {
  ApiBody,
  ApiQuery,
  ApiTags,
  ApiParam,
  ApiResponse,
  ApiOperation,
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
  Controller,
} from '@nestjs/common';
import {
  ApiErrorType,
  buildApiErrorResponse,
} from 'src/common/enums/api-error.types';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  /**
   *
   * @returns {SuccessResponseDto<PaginatedServicesDto>} Devuelve una lista de servicios según parámetros de paginación
   * @param {PaginationDto} paginationDto Lista de parámetros para filtrar
   */
  @Get()
  @ApiOperation({ summary: 'Obtener lista de Servicios' })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<PaginatedServicesDto>,
    example: {
      success: true,
      data: {
        items: [
          {
            services_id: 6,
            created_at: '2025-11-11T04:38:28.272Z',
            observation: null,
            total_amount: '60.50',
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
  ): Promise<SuccessResponseDto<PaginatedServicesDto>> {
    const res = await this.servicesService.findAll(paginationDto);
    return new SuccessResponseDto({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<ServiceResponseDto>} Devuelve servicio dado el Id
   * @param {number} serviceId Id del servicio
   */
  @Get(':serviceId')
  @ApiOperation({ summary: 'Obtener Servicio dado el id' })
  @ApiParam({
    name: 'serviceId',
    type: Number,
    required: true,
    description: 'ID del servicio',
    example: 10,
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/services/{serviceId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Servicio con ID 10 no encontrado',
    ),
  })
  async findById(
    @Param('serviceId') serviceId: number,
  ): Promise<SuccessResponseDto<ServiceResponseDto>> {
    const res = await this.servicesService.findById(serviceId);
    return new SuccessResponseDto({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<ServiceResponseDto>}
   * @param {CreatePetDto} newService Servicio a crear
   */
  @Post()
  @ApiOperation({ summary: 'Registra nuevo servicio' })
  @ApiBody({ type: CreateServiceDto })
  async create(
    @Body() newService: CreateServiceDto,
  ): Promise<SuccessResponseDto<ServiceResponseDto>> {
    await this.servicesService.create(newService);
    return new SuccessResponseDto({
      message: 'Se han registrado los servicios',
    });
  }

  @Patch(':serviceId')
  update(
    @Param('serviceId') serviceId: number,
    @Body() newService: UpdateServiceDto,
  ) {
    return this.servicesService.update(serviceId, newService);
  }

  /**
   * @param {number} serviceId Id del servicio a eliminar
   */
  @Delete(':serviceId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar servicio' })
  @ApiParam({
    name: 'serviceId',
    type: Number,
    required: true,
    description: 'ID del servicio',
    example: 10,
  })
  delete(@Param('serviceId') serviceId: number) {
    return this.servicesService.delete(serviceId);
  }
}
