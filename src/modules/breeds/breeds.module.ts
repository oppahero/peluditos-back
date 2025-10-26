import { forwardRef, Module } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { BreedsController } from './breeds.controller';
import { Breeds } from './entities/breeds.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Breeds]), forwardRef(() => AuthModule)],
  controllers: [BreedsController],
  providers: [BreedsService],
})
export class BreedsModule {}
