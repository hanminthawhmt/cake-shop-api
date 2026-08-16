import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email.service';
import { OrderStatusUpdatedEvent } from '../../orders/events/order-status-updated.event';
import { OrderStatus } from '../../orders/enums/order.enum';

@Injectable()
export class OrderStatusEmailListener {
  constructor(private emailService: EmailService) {}

  @OnEvent('order.status_updated')
  async handleOrderStatusUpdated(event: OrderStatusUpdatedEvent) {
    if (event.newStatus === OrderStatus.CONFIRMED) {
      return; // already emailed at creation, skip duplicate
    }

    const statusMessages: Partial<Record<OrderStatus, string>> = {
      [OrderStatus.PREPARING]: 'Your order is now being prepared!',
      [OrderStatus.READY_FOR_PICK_UP]: 'Your order is ready for pickup!',
      [OrderStatus.COMPLETED]: 'Thanks for picking up your order!',
    };

    const message = statusMessages[event.newStatus];
    if (!message) {
      return; // no email defined for this status
    }
    const html = `
      <h2>Order Update</h2>
      <p>Hi ${event.customerName},</p>
      <p>${message}</p>
      <p>Order #${event.orderId}</p>
    `;

    await this.emailService.sendEmail(
      event.customerEmail,
      `Order #${event.orderId} Update`,
      html,
    );
  }
}
