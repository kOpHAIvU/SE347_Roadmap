import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { Server, Socket } from 'socket.io';
import { Notification } from './entities/notification.entity';
import { NotificationController } from './notification.controller';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/notification_roadmap',
  cors: {
    origin: '*',
    //methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
  },
})
export class NotificationGateway 
      implements OnGatewayInit, 
                OnGatewayConnection, 
                OnGatewayDisconnect   {

  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
    this.server = server;
  }

  handleConnection(client: Socket) {
    console.log('Client connected to websocket 2:', {
      clientId: client.id,
    });
    //client.join('2');
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', {
      clientId: client.id,
    });
  }

  ///@SubscribeMessage('new_roadmap_notification')
  handleSendNotificationWhenHavingNewRoadmap(
    //@MessageBody() payload: { notification: Notification, }
    notification: Notification
  ) {
    if (this.server) {
      return this.server.emit('new_roadmap', {
          statusCode: 200,
          message: 'New roadmap has been uploaded',
          data: notification,
      });
  } else {
      console.error('WebSocket server is not ready');
  }
  }
}
