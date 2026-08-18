import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email.service';
import { ReservationCreatedEvent } from '../../rooms/events/reservation-created.event';

@Injectable()
export class ReservationCreatedEmailListener {
  constructor(private emailService: EmailService) {}

  @OnEvent('reservation.created')
  async handleReservationCreated(event: ReservationCreatedEvent) {
    try {
      const html = `
      <h2>Reservation Confirmed!</h2>
      <p>Hi ${event.customerName}, your room reservation is confirmed.</p>
      <p>Room: ${event.roomName}</p>
      <p>Date: ${event.date} at ${event.timeSlot}</p>
    `;
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
