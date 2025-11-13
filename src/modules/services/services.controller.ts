import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { ServiceResponseDto } from './dto/service-response.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedServicesDto } from './dto/paginated-services.dto';

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
   * @returns {SuccessResponseDto<ServiceResponseDto>} Devuelve service creado
   * @param {CreatePetDto} newService Servicio a crear
   */
  @Post()
  @ApiBody({ type: CreateServiceDto })
  async create(
    @Body() newService: CreateServiceDto,
  ): Promise<SuccessResponseDto<ServiceResponseDto>> {
    const res = await this.servicesService.create(newService);
    return new SuccessResponseDto({ data: res });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(+id, updateServiceDto);
  }
}
