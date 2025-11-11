import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { ServiceResponseDto } from './dto/service-response.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';
import { ApiBody } from '@nestjs/swagger';
import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiBody({ type: CreateServiceDto })
  async create(
    @Body() newService: CreateServiceDto,
  ): Promise<SuccessResponseDto<ServiceResponseDto>> {
    const res = await this.servicesService.create(newService);
    return new SuccessResponseDto({ data: res });
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
