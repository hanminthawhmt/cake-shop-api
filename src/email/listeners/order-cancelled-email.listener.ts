import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email.service';
import { OrderCancelledEvent } from '../../orders/events/order-cancelled.event';
import {
  generateEmailTemplate,
  bodyParagraph,
  detailsBox,
  listItem,
} from '../templates/base-email.template';

@Injectable()
export class OrderCancelledEmailListener {
  constructor(private emailService: EmailService) {}

  @OnEvent('order.cancelled')
  async handleOrderCancelled(event: OrderCancelledEvent) {
    try {
      const body = `
        ${bodyParagraph(`Hi ${event.customerName}, we wanted to let you know that your order has been cancelled.`)}
        
        ${detailsBox(`
          ${listItem('Order Number:', `#${event.orderId}`)}
        `)}

        ${bodyParagraph('If you have any questions or would like to place a new order, please don\'t hesitate to reach out. We\'d love to serve you again!')}
      `;

      const html = generateEmailTemplate({
        title: 'Order Cancelled',
        body,
        buttonText: 'Place a New Order',
        buttonUrl: 'https://petalcocoa.com/order',
      });

      await this.emailService.sendEmail(
        event.customerEmail,
        `Order #${event.orderId} Cancelled`,
        html,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        `Failed to send order cancellation email for order #${event.orderId}:`,
        message,
      );
    }
  }
}
