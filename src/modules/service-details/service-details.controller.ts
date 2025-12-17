import { Get, Body, Patch, Param, Delete, Controller } from '@nestjs/common';
import { UpdateServiceDetailDto } from './dto/update-service-detail.dto';
import { ServiceDetailsService } from './service-details.service';

@Controller('service-details')
export class ServiceDetailsController {
  constructor(private readonly serviceDetailsService: ServiceDetailsService) {}

  @Get()
  findAll() {
    return this.serviceDetailsService.findAll();
  }

  @Get(':detailId')
  findOne(@Param('detailId') detailId: number) {
    return this.serviceDetailsService.findOne(detailId);
  }

  @Patch(':detailId')
  update(
    @Param('detailId') detailId: number,
    @Body() updateServiceDetailDto: UpdateServiceDetailDto,
  ) {
    return this.serviceDetailsService.update(detailId, updateServiceDetailDto);
  }

  @Delete(':detailId')
  delete(@Param('detailId') detailId: number) {
    return this.serviceDetailsService.delete(detailId);
  }
}
