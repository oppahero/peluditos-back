import { LegalEntitiesController } from './legal-entities.controller';
import { LegalEntitiesService } from './legal-entities.service';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegalEntity } from './entities/legal-entity.entity';
import { PersonsModule } from '../persons/persons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LegalEntity]),
    forwardRef(() => AuthModule),
    PersonsModule,
  ],
  controllers: [LegalEntitiesController],
  providers: [LegalEntitiesService],
})
export class LegalEntitiesModule {}
