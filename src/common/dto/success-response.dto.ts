import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SuccessResponseDto<T> {
  @ApiProperty({ example: true })
  success = true;

  @ApiPropertyOptional({ example: 'Mensaje' })
  message?: string;

  @ApiPropertyOptional({ example: {} })
  data?: T;

  constructor(init?: Partial<SuccessResponseDto<T>>) {
    Object.assign(this, init);
  }
}
