import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport(
      {
        host: this.configService.get<string>('MAILTRAP_HOST'),
        port: this.configService.get<number>('MAILTRAP_PORT'),
        auth: {
          user: this.configService.get<string>('MAILTRAP_USER'),
          pass: this.configService.get<string>('MAILTRAP_PASS'),
        },
      },
      {
        from: this.configService.get<string>('MAIL_FROM'),
      },
    );
  }
  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      to,
      subject,
      html,
    });
  }
}
