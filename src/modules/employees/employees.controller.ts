import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { PaginatedEmployeesDto } from './dto/paginated-employees.dto';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';
import {
  ApiBody,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiOperation,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiBearerAuth,
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
  UseGuards,
} from '@nestjs/common';
import {
  ApiErrorType,
  buildApiErrorResponse,
} from 'src/common/enums/api-error.types';

@ApiTags('Empleados')
@Controller('employees')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  /**
   *
   * @returns {SuccessResponseDto<PaginatedEmployeesDto>} Devuelve una lista de Empleados
   * @param {Request} request Lista de parámetros para filtrar
   */
  @Get()
  @ApiOperation({ summary: 'Obtener lista de Empleados' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedEmployeesDto>> {
    const res = await this.employeesService.findAll(paginationDto);
    return new SuccessResponseDto<PaginatedEmployeesDto>({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<EmployeeResponseDto>} Devuelve datos del empleado dado el Id
   * @param {number} personId Id de la persona
   */
  @Get(':personId')
  @ApiOperation({ summary: 'Obtener datos del empleado dado el id' })
  @ApiParam({
    name: 'personId',
    type: Number,
    required: true,
    description: 'ID del empleado',
    example: 10,
  })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto<EmployeeResponseDto>,
    example: {
      success: true,
      data: {
        person_id: 31,
        natural_person: {
          person: {
            name: 'Paola López',
            phone: '04121939372',
            email: 'paola@gmail.com',
            address: 'Alta Vista',
            taxpayer_type: 'V',
          },
          dni: '25040204',
          birthdate: '1995-11-15',
          gender: 'F',
        },
        status: true,
        created_at: '2025-11-02T20:55:38.427Z',
        updated_at: '2025-11-02T20:55:38.427Z',
      },
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/employees/{personId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Empleado con ID 10 no encontrado',
    ),
  })
  async findById(
    @Param('personId') personId: number,
  ): Promise<SuccessResponseDto<EmployeeResponseDto>> {
    const res = await this.employeesService.findById(personId);
    return new SuccessResponseDto<EmployeeResponseDto>({ data: res });
  }

  /**
   *
   * @returns {SuccessResponseDto<EmployeeResponseDto>} Devuelve Empleado creado
   * @param {CreateEmployeeDto} newEmployee Empleado a crear
   */
  @Post()
  @ApiOperation({ summary: 'Registra nuevo empleado' })
  @ApiBody({ type: CreateEmployeeDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto<EmployeeResponseDto>,
    example: {
      message: 'Empleado creado exitosamente',
      data: {
        person_id: 31,
        natural_person: {
          person: {
            name: 'Paola López',
            phone: '04121939372',
            email: 'paola@gmail.com',
            address: 'Alta Vista',
            taxpayer_type: 'V',
          },
          dni: '25040204',
          birthdate: '1995-11-15T04:00:00.000Z',
          gender: 'F',
        },
        status: true,
        created_at: '2025-11-02T20:55:38.427Z',
        updated_at: '2025-11-02T20:55:38.427Z',
      },
    },
  })
  @ApiConflictResponse({
    example: buildApiErrorResponse(
      409,
      'v1/employees',
      ApiErrorType.CONFLICT,
      'Existe una persona registrada con ese dni (25040204)',
    ),
  })
  async create(
    @Body() newEmployee: CreateEmployeeDto,
  ): Promise<SuccessResponseDto<EmployeeResponseDto>> {
    const res = await this.employeesService.createWithManager(newEmployee);
    return new SuccessResponseDto<EmployeeResponseDto>({
      data: res,
      message: 'Empleado creado exitosamente',
    });
  }

  /**
   *
   * @returns {SuccessResponseDto<EmployeeResponseDto>} Devuelve Empleado modificado
   * @param {UpdateEmployeeDto} newEmployee empleado a modificar
   */
  @Patch(':personId')
  @ApiOperation({ summary: 'Modificar empleado' })
  @ApiParam({
    name: 'personId',
    type: Number,
    required: true,
    description: 'ID del empleado',
    example: 10,
  })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto<EmployeeResponseDto>,
    example: {
      success: true,
      data: {
        person_id: 32,
        natural_person: {
          person: {
            name: 'Paola López',
            phone: '04121939372',
            email: 'paola@gmail.com',
            address: 'Alta Vista',
            taxpayer_type: 'V',
          },
          dni: '25040204',
          birthdate: '1995-11-15',
          gender: 'F',
        },
        type_of_employee: 'Bioanalista',
        status: true,
        created_at: '2025-11-02T21:08:08.646Z',
        updated_at: '2025-11-02T21:08:08.646Z',
      },
      message: 'Persona natural actualizada exitosamente',
    },
  })
  @ApiNotFoundResponse({
    example: buildApiErrorResponse(
      404,
      '/api/v1/employees/{personId}',
      ApiErrorType.RESOURCE_NOT_FOUND,
      'Empleado con ID 10 no encontrado',
    ),
  })
  @ApiConflictResponse({
    example: buildApiErrorResponse(
      409,
      'v1/employees/{personId}',
      ApiErrorType.CONFLICT,
      'Ya existe una persona con ese dni (25040204)',
    ),
  })
  async update(
    @Param('personId') personId: number,
    @Body() newEmployee: UpdateEmployeeDto,
  ): Promise<SuccessResponseDto<EmployeeResponseDto>> {
    const res = await this.employeesService.updateWithManager(
      personId,
      newEmployee,
    );

    return new SuccessResponseDto<EmployeeResponseDto>({
      data: res,
      message: 'Empleado actualizado exitosamente',
    });
  }

  /**
   * @param {number} personId Id de la persona a eliminar
   */
  @Delete(':personId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar empleado' })
  @ApiParam({
    name: 'personId',
    type: Number,
    required: true,
    description: 'ID del empleado',
    example: 10,
  })
  delete(@Param('personId') personId: number) {
    return this.employeesService.delete(personId);
  }
}
