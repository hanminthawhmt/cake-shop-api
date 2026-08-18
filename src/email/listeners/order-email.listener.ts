import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email.service';
import { OrderCreatedEvent } from '../../orders/events/order-created.event';

@Injectable()
export class OrderEmailListener {
  constructor(private emailService: EmailService) {}

  @OnEvent('order.created')
  async handleCreatedOrder(event: OrderCreatedEvent) {
    try {
      const itemsHtml = await event.items
        .map((i) => `<li>${i.cakeName} × ${i.quantity}</li>`)
        .join('');
      const html = `
      <h2>Order Confirmed!</h2>
      <p>Hi ${event.customerName}, thanks for your order.</p>
      <p><strong>Order #${event.orderId}</strong></p>
      <p>Pickup: ${event.pickupDate} at ${event.pickupTime}</p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total: ฿${event.totalPrice}</strong></p>
    `;
      await this.emailService.sendEmail(
        event.customerEmail,
        `Order Confirmation #${event.orderId}`,
        html,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        `Failed to send order confirmation email for order #${event.orderId}:`,
        message,
      );
    }
  }
}
