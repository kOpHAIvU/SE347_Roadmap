import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationWorker {
  private queue: any[] = []; 

  constructor(private readonly notificationGateway: NotificationGateway) {}

  addNotification(notification: any) {
    this.queue.push(notification);
    this.processQueue();
    return 
  }

  processQueue() {
    if (this.notificationGateway.server.sockets.sockets.size > 0) {
      while (this.queue.length > 0) {
        const notification = this.queue.shift(); 
        this.notificationGateway.handleSendNotificationWhenHavingNewRoadmap(notification);
      }
    } else {
      console.log('No WebSocket clients connected. Notifications are queued.');
    }
  }
}
