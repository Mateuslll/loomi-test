import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    activationLink: string,
    subject: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        from: process.env.MAIL_FROM,
        subject,
        html: this.generateEmailHtml(activationLink),
      });
    } catch (error) {
      throw new BadRequestException('Failed to send email.', error.message);
    }
  }

  private generateEmailHtml(activationLink: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Confirmation</title>
      </head>
      <body>
        <p>Welcome to our platform!</p>
        <p>To activate your account, please click the link below:</p>
        <p><a href="${activationLink}">Activate my account</a></p>
        <p>If you did not request this email, please ignore it.</p>
        <p>Thank you,</p>
        <p>The Team</p>
      </body>
      </html>
    `;
  }
}
