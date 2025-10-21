import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('HOST'),
      port: this.configService.get<number>('PORT') ?? 5432,
      username: this.configService.get<string>('USER'),
      password: this.configService.get<string>('PASSWORD'),
      database: this.configService.get<string>('DATABASE'),
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    };
  }
}
