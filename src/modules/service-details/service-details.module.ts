import { ServiceDetailsController } from './service-details.controller';
import { ServiceDetailsService } from './service-details.service';
import { ServiceDetail } from './entities/service-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeesModule } from '../employees/employees.module';
import { TypesOfServicesModule } from '../types-of-services/types-of-services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceDetail]),
    forwardRef(() => AuthModule),
    EmployeesModule,
    TypesOfServicesModule,
  ],
  controllers: [ServiceDetailsController],
  providers: [ServiceDetailsService],
  exports: [ServiceDetailsService],
})
export class ServiceDetailsModule {}
