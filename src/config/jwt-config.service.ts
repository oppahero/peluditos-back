import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get secret(): string {
    const value = this.configService.get<string>('JWT_SECRET');
    if (!value) throw new Error('JWT_SECRET is missing');
    return value;
  }

  get expiresIn(): any {
    return this.configService.get<string>('JWT_EXPIRES_IN', '1d');
  }
}
