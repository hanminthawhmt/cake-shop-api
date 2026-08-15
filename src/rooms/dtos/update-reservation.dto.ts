import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReservationStatus } from '../enums/room.enum';

export class UpdateReservationStatusDto {
  @IsNotEmpty()
  @IsEnum(ReservationStatus, {
    message: `status must be one of: ${Object.values(ReservationStatus).join(', ')}`,
  })
  status: ReservationStatus;
}
