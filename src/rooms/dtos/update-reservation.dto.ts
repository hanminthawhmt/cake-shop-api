import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../enums/room.enum';

export class UpdateReservationStatusDto {
  @ApiProperty({
    enum: ReservationStatus,
    example: ReservationStatus.CONFIRMED,
    description: 'New reservation status to set.',
  })
  @IsNotEmpty()
  @IsEnum(ReservationStatus, {
    message: `status must be one of: ${Object.values(ReservationStatus).join(', ')}`,
  })
  status: ReservationStatus;
}
