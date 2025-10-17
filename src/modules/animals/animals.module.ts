import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animals } from './animals.entity';
import { AnimalsService } from './animals.service';
import { AnimalsController } from './animals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Animals])],
  providers: [AnimalsService],
  controllers: [AnimalsController],
})
export class AnimalsModule {}
