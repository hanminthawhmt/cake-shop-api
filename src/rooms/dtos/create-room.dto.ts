import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: 'Garden Room', description: 'Name of the room.' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Room with a scenic garden view and natural light.',
    description: 'Optional description of the room.',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 6, description: 'Maximum guest capacity of the room.', minimum: 1 })
  @IsInt()
  @IsPositive()
  capacity: number;

  @ApiProperty({ example: 150.0, description: 'Room price per reservation.', minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;
}
