import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentStatus } from '../enums/order.enum';

export class UpdatePaymentStatusDto {
  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.PAID })
  @IsNotEmpty()
  @IsEnum(PaymentStatus, {
    message: `status must be one of: ${Object.values(PaymentStatus).join(', ')}`,
  })
  paymentStatus: PaymentStatus;
}
