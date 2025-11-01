import { AnimalsController } from './animals.controller';
import { forwardRef, Module } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { Animal } from './entities/animal.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Animal]), forwardRef(() => AuthModule)],
  providers: [AnimalsService],
  controllers: [AnimalsController],
})
export class AnimalsModule {}
