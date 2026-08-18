import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email.service';
import { OrderStatusUpdatedEvent } from '../../orders/events/order-status-updated.event';
import { OrderStatus } from '../../orders/enums/order.enum';
import {
  generateEmailTemplate,
  bodyParagraph,
  detailsBox,
  listItem,
} from '../templates/base-email.template';

@Injectable()
export class OrderStatusEmailListener {
  constructor(private emailService: EmailService) {}

  @OnEvent('order.status_updated')
  async handleOrderStatusUpdated(event: OrderStatusUpdatedEvent) {
    try {
      if (event.newStatus === OrderStatus.CONFIRMED) {
        return; // already emailed at creation, skip duplicate
      }

      const statusConfig: Partial<
        Record<OrderStatus, { title: string; message: string; cta?: string }>
      > = {
        [OrderStatus.PREPARING]: {
          title: 'Your Order is Being Prepared',
          message:
            'Our talented pastry chefs are now crafting your delicious cakes with care and precision. We\'ll notify you when everything is ready for pickup!',
          cta: 'Track Your Order',
        },
        [OrderStatus.READY_FOR_PICK_UP]: {
          title: 'Your Order is Ready!',
          message:
            'Great news! Your order is now ready for pickup. Please visit us at your scheduled time to collect your fresh, beautiful cakes.',
          cta: 'View Pickup Details',
        },
        [OrderStatus.COMPLETED]: {
          title: 'Thanks for Your Order!',
          message:
            'Thank you for choosing Petal & Cocoa! We hope you enjoyed every bite. We\'d love to see you again soon.',
        },
      };

      const config = statusConfig[event.newStatus];
      if (!config) {
        return; // no email defined for this status
      }

      const body = `
        ${bodyParagraph(`Hi ${event.customerName},`)}
        ${bodyParagraph(config.message)}
        ${detailsBox(`
          ${listItem('Order Number:', `#${event.orderId}`)}
        `)}
      `;

      const html = generateEmailTemplate({
        title: config.title,
        body,
        buttonText: config.cta,
        buttonUrl: `https://petalcocoa.com/orders/${event.orderId}`,
      });

      await this.emailService.sendEmail(
        event.customerEmail,
        `Order #${event.orderId} Update`,
        html,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        `Failed to send order status update email for order #${event.orderId}:`,
        message,
      );
    }
  }
}
