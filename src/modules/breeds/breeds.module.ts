import { forwardRef, Module } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { BreedsController } from './breeds.controller';
import { Breed } from './entities/breed.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Breed]), forwardRef(() => AuthModule)],
  controllers: [BreedsController],
  providers: [BreedsService],
})
export class BreedsModule {}
