import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string | undefined {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('HOST'),
      port: parseInt(this.getValue('PORT') ?? '5432'),
      username: this.getValue('USER'),
      password: this.getValue('PASSWORD'),
      database: this.getValue('DATABASE'),
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'HOST',
  'PORT',
  'USER',
  'PASSWORD',
  'DATABASE',
]);

export { configService };
