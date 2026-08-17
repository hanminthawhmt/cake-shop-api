import {
  IsDateString,
  IsEnum,
  IsInt,
  IsPositive,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TimeSlot } from '../enums/room.enum';

export class CreateReservationDto {
  @ApiProperty({
    example: '2026-08-20',
    description: 'Reserved date in ISO format (YYYY-MM-DD).',
  })
  @IsDateString(
    {},
    { message: 'date must be a valid ISO date string (YYYY-MM-DD)' },
  )
  date: string;

  @ApiProperty({
    enum: TimeSlot,
    example: TimeSlot.SLOT_10_00,
    description: 'Selected time slot for the reservation.',
  })
  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;

  @ApiProperty({
    example: 4,
    description: 'Number of guests attending.',
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  guestCount: number;

  @ApiPropertyOptional({
    example: 'Birthday cake decoration needed',
    description: 'Optional special requirements for the reservation.',
  })
  @IsOptional()
  @IsString()
  birthdayRequirements?: string;
}
