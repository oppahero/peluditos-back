import { UserResponseDto } from 'src/modules/users/dto/users-response.dto';
import { PetResponseDto } from 'src/modules/pets/dto/pet-response.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ServiceResponseDto {
  @ApiProperty({ example: 10 })
  @Expose()
  readonly services_id: number;

  @ApiProperty({ example: '2025-11-01' })
  @Expose()
  readonly created_at: Date;

  @ApiProperty({ example: 'Perrito con ansiedad' })
  @Expose()
  readonly observation: string | null;

  @ApiProperty({ example: 60 })
  @Expose()
  readonly total_amount: number;

  @ApiProperty({ type: PetResponseDto })
  @Expose()
  @Type(() => PetResponseDto)
  readonly pet: PetResponseDto;

  @ApiProperty({ type: UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  readonly user: UserResponseDto;
}
