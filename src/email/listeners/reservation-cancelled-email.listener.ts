import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email.service';
import { ReservationCancelledEvent } from '../../rooms/events/reservation-cancelled.event';
import {
  generateEmailTemplate,
  bodyParagraph,
  detailsBox,
  listItem,
} from '../templates/base-email.template';

@Injectable()
export class ReservationCancelledEmailListener {
  constructor(private emailService: EmailService) {}

  @OnEvent('reservation.cancelled')
  async handleReservationCancelled(event: ReservationCancelledEvent) {
    try {
      const body = `
        ${bodyParagraph(`Hi ${event.customerName}, we wanted to confirm that your reservation has been cancelled.`)}
        
        ${detailsBox(`
          ${listItem('Reservation Number:', `#${event.reservationId}`)}
        `)}

        ${bodyParagraph('We\'d love to have you visit us another time! Feel free to make a new reservation whenever you\'re ready.')}
      `;

      const html = generateEmailTemplate({
        title: 'Reservation Cancelled',
        body,
        buttonText: 'Make a New Reservation',
        buttonUrl: 'https://petalcocoa.com/reserve',
      });

      await this.emailService.sendEmail(
        event.customerEmail,
        `Reservation #${event.reservationId} Cancelled`,
        html,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        `Failed to send reservation cancellation email for reservation #${event.reservationId}:`,
        message,
      );
    }
  }
}
