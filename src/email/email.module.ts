import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { OrderEmailListener } from './listeners/order-email.listener';
import { OrderStatusEmailListener } from './listeners/order-status-email.listener';
import { UserRegisteredEmailListener } from './listeners/user-registered-email.listener';
import { ReservationCancelledEmailListener } from './listeners/reservation-cancelled-email.listener';
import { ReservationCreatedEmailListener } from './listeners/reservation-created-email.listener';
import { OrderCancelledEmailListener } from './listeners/order-cancelled-email.listener';

@Module({
  providers: [
    EmailService,
    OrderEmailListener,
    OrderStatusEmailListener,
    ReservationCancelledEmailListener,
    ReservationCreatedEmailListener,
    UserRegisteredEmailListener,
    OrderCancelledEmailListener
  ],
  exports: [EmailService],
})
export class EmailModule {}
