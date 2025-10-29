import { AnimalsController } from './animals.controller';
import { forwardRef, Module } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { Animals } from './entities/animals.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Animals]), forwardRef(() => AuthModule)],
  providers: [AnimalsService],
  controllers: [AnimalsController],
})
export class AnimalsModule {}
