import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email.service';
import { OrderCreatedEvent } from '../../orders/events/order-created.event';
import {
  generateEmailTemplate,
  bodyParagraph,
  detailsBox,
  listItem,
} from '../templates/base-email.template';

@Injectable()
export class OrderEmailListener {
  constructor(private emailService: EmailService) {}

  @OnEvent('order.created')
  async handleCreatedOrder(event: OrderCreatedEvent) {
    try {
      // Build the items list
      const itemsList = event.items
        .map((i) => `<li style="margin: 8px 0; color: #5C4A48; font-size: 14px;">${i.cakeName} <span style="color: #A67C7B;">× ${i.quantity}</span></li>`)
        .join('');

      // Build the email body content
      const body = `
        ${bodyParagraph(`Hi ${event.customerName}, thanks for your order! We're excited to prepare your delicious cakes.`)}

        ${detailsBox(`
          ${listItem('Order Number:', `#${event.orderId}`)}
          ${listItem('Pickup Date:', event.pickupDate)}
          ${listItem('Pickup Time:', event.pickupTime)}
        `)}

        ${bodyParagraph('<strong style="color: #8B5A5A;">Your Items:</strong>')}
        <ul style="margin: 10px 0 20px 0; padding-left: 20px; list-style: none;">
          ${itemsList}
        </ul>

        ${detailsBox(`
          <div style="text-align: center;">
            <p style="margin: 0 0 10px 0; color: #A67C7B; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Total Amount</p>
            <p style="margin: 0; color: #D4A5A0; font-size: 32px; font-weight: 600;">฿${event.totalPrice.toFixed(2)}</p>
          </div>
        `)}

        ${bodyParagraph('Please arrive 10-15 minutes before your scheduled pickup time. If you have any questions, feel free to reach out!')}
      `;

      const html = generateEmailTemplate({
        title: 'Order Confirmed!',
        body,
      });

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
