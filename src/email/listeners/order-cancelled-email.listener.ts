import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email.service';
import { OrderCancelledEvent } from '../../orders/events/order-cancelled.event';

@Injectable()
export class OrderCancelledEmailListener {
  constructor(private emailService: EmailService) {}

  @OnEvent('order.cancelled')
  async handleOrderCancelled(event: OrderCancelledEvent) {
    const html = `
      <h2>Order Cancelled</h2>
      <p>Hi ${event.customerName}, your order #${event.orderId} has been cancelled.</p>
    `;
    await this.emailService.sendEmail(
      event.customerEmail,
      `Order #${event.orderId} Cancelled`,
      html,
    );
  }
}
