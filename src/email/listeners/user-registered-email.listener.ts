import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email.service';
import { UserRegisteredEvent } from '../../users/events/user-registered.event';
import {
  generateEmailTemplate,
  bodyParagraph,
} from '../templates/base-email.template';

@Injectable()
export class UserRegisteredEmailListener {
  constructor(private emailService: EmailService) {}

  @OnEvent('user.registered')
  async handleUserRegistered(event: UserRegisteredEvent) {
    try {
      const body = `
        ${bodyParagraph(`Welcome to Petal & Cocoa, ${event.name}! We're thrilled to have you join our community.`)}
        ${bodyParagraph('Your account is now active and ready to explore our artisan cakes, pastries, and cozy lounge space.')}
        ${bodyParagraph('Start browsing our collection and place your first order to enjoy a 10% discount on your next visit!')}
      `;

      const html = generateEmailTemplate({
        title: 'Welcome to Petal & Cocoa!',
        body,
        buttonText: 'Browse Our Menu',
        buttonUrl: 'https://petalcocoa.com/menu',
      });

      await this.emailService.sendEmail(
        event.email,
        'Welcome to Petal & Cocoa',
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
