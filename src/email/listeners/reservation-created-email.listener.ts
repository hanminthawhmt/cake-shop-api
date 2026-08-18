import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email.service';
import { ReservationCreatedEvent } from '../../rooms/events/reservation-created.event';
import {
  generateEmailTemplate,
  bodyParagraph,
  detailsBox,
  listItem,
} from '../templates/base-email.template';

@Injectable()
export class ReservationCreatedEmailListener {
  constructor(private emailService: EmailService) {}

  @OnEvent('reservation.created')
  async handleReservationCreated(event: ReservationCreatedEvent) {
    try {
      const body = `
        ${bodyParagraph(`Hi ${event.customerName}, your room reservation at Petal & Cocoa is confirmed!`)}

        ${detailsBox(`
          ${listItem('Reservation Number:', `#${event.reservationId}`)}
          ${listItem('Room:', event.roomName)}
          ${listItem('Date:', event.date)}
          ${listItem('Time:', event.timeSlot)}
        `)}

        ${bodyParagraph('Please arrive 10-15 minutes early to check in. Our team will ensure you have a wonderful experience in our cozy lounge space.')}
        ${bodyParagraph('If you need to reschedule or cancel, please let us know as soon as possible. Enjoy your visit!')}
      `;

      const html = generateEmailTemplate({
        title: 'Reservation Confirmed!',
        body,
      });

      await this.emailService.sendEmail(
        event.customerEmail,
        `Reservation Confirmation #${event.reservationId}`,
        html,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        `Failed to send reservation confirmation email for reservation #${event.reservationId}:`,
        message,
      );
    }
  }
}
