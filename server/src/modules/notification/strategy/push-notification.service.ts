import { Injectable } from '@nestjs/common';
import { NotificationStrategy } from './notification.interface.service';

@Injectable()
export class PushNotificationStrategy implements NotificationStrategy {
  async sendNotification(recipient: string, message: string): Promise<void> {
    console.log(`Push notification sent to ${recipient}: ${message}`);
    // Implement push notification logic (e.g., Firebase Cloud Messaging)
  }
}
