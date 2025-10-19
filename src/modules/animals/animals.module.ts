import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animals } from './animals.entity';
import { AnimalsService } from './animals.service';
import { AnimalsController } from './animals.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Animals]), forwardRef(() => AuthModule)],
  providers: [AnimalsService],
  controllers: [AnimalsController],
})
export class AnimalsModule {}
