import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email.service';
import { ReservationCancelledEvent } from '../../rooms/events/reservation-cancelled.event';

@Injectable()
export class ReservationCancelledEmailListener {
  constructor(private emailService: EmailService) {}

  @OnEvent('reservation.cancelled')
  async handleReservationCancelled(event: ReservationCancelledEvent) {
    try {
      const html = `
      <h2>Reservation Cancelled</h2>
      <p>Hi ${event.customerName}, your reservation #${event.reservationId} has been cancelled.</p>
    `;
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
