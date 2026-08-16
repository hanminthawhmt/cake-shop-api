import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { OrderEmailListener } from './listeners/order-email.listener';
import { OrderStatusEmailListener } from './listeners/order-status-email.listener';

@Module({
  providers: [EmailService, OrderEmailListener, OrderStatusEmailListener],
  exports: [EmailService],
})
export class EmailModule {}
