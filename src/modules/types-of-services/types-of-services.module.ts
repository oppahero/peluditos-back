import { forwardRef, Module } from '@nestjs/common';
import { TypesOfServiceService } from './types-of-services.service';
import { TypesOfServicesController } from './types-of-services.controller';
import { TypesOfService } from './entities/type-of-service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypesOfService]),
    forwardRef(() => AuthModule),
  ],
  controllers: [TypesOfServicesController],
  providers: [TypesOfServiceService],
})
export class TypesOfServicesModule {}
