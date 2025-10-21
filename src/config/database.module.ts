import { Module } from '@nestjs/common';
import { DatabaseConfigService } from './database.service';

@Module({
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseConfigModule {}
