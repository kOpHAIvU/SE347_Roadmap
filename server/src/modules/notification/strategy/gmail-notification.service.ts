import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { google } from 'googleapis';
import * as nodemailer from 'nodemailer';

@Injectable()
export class GmailNotificationStrategy {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Gmail SMTP
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
    attachments?: nodemailer.Attachment[],
  ) {
    try {
      
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
        attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
