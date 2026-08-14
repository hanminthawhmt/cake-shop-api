import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateOrderDto {
  @IsDateString(
    {},
    { message: 'pickupDate must be a valid ISO date string (YYYY-MM-DD)' },
  )
  @IsNotEmpty()
  pickupDate: string;

  // Enforces 24-hour time format (HH:MM or HH:MM:SS) e.g., "14:30" or "09:00:00"
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'pickupTime must be a valid time in HH:mm or HH:mm:ss format',
  })
  @IsNotEmpty()
  pickupTime: string;
}
