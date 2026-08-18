import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email.service';
import { UserRegisteredEvent } from '../../users/events/user-registered.event';

@Injectable()
export class UserRegisteredEmailListener {
  constructor(private emailService: EmailService) {}

  @OnEvent('user.registered')
  async handleUserRegistered(event: UserRegisteredEvent) {
    try {
      const html = `
      <h2>Welcome to Cake Shop!</h2>
      <p>Hi ${event.name}, thanks for signing up.</p>
    `;
      await this.emailService.sendEmail(
        event.email,
        'Welcome to Cake Shop',
        html,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        `Failed to send user registration email for user ${event.email}:`,
        message,
      );
    }
  }
}
