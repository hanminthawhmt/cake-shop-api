import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: '2026-08-20',
    description: 'Pickup date, must be at least 1 day in advance',
  })
  @IsDateString(
    {},
    { message: 'pickupDate must be a valid ISO date string (YYYY-MM-DD)' },
  )
  @IsNotEmpty()
  pickupDate: string;

  // Enforces 24-hour time format (HH:MM or HH:MM:SS) e.g., "14:30" or "09:00:00"
  @ApiProperty({ example: '14:00', description: 'Pickup time in HH:mm format' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'pickupTime must be a valid time in HH:mm or HH:mm:ss format',
  })
  @IsNotEmpty()
  pickupTime: string;
}
