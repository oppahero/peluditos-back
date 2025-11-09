import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePetDto } from './create-pet.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdatePetDto extends PartialType(CreatePetDto) {
  @IsInt()
  @IsOptional()
  @ApiProperty({ example: 6 })
  breed_id?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({ example: 33 })
  person_id?: number;
}
