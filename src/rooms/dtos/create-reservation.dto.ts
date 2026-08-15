import {
  IsDateString,
  IsEnum,
  IsInt,
  IsPositive,
  IsOptional,
  IsString,
} from 'class-validator';
import { TimeSlot } from '../enums/room.enum';

export class CreateReservationDto {
  @IsDateString(
    {},
    { message: 'date must be a valid ISO date string (YYYY-MM-DD)' },
  )
  date: string;

  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;

  @IsInt()
  @IsPositive()
  guestCount: number;

  @IsOptional()
  @IsString()
  birthdayRequirements?: string;
}
