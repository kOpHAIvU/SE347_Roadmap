import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

  private userId: number;
  private teamId: number;

  constructor(
    private readonly messageService: MessageService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.server = server;
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    this.teamId = Number(client.handshake.query.teamId as string);
    this.userId = Number(client.handshake.query.userId as string);

    console.log('Client connected:', {
      clientId: client.id,
      teamId: this.teamId,
      userId: this.userId,
    });

    if (!this.teamId || !this.userId) {
      console.error('Connection rejected: Missing teamId or userId', client.id);
      client.disconnect();
      return;
    }
    client.join(this.teamId.toString());

  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', {
      clientId: client.id,
      teamId: client.data.teamId,
      userId: client.data.userId,
    });
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    client: Socket,
    @MessageBody() payload: { message: string }
  ): Promise<void> {
  

    console.log('Received message:', {
      teamId: this.teamId,
      userId :this.userId,
      message: payload.message,
    });

    if (!payload.message || payload.message.trim() === '') {
      console.error('Empty message received from client:', client.id);
      client.emit('error', 'Message cannot be empty');
      return;
    }

    try {
      const newMessage = await this.messageService.create({
        senderId: this.userId,
        teamId: this.teamId,
        check: false,
        content: payload.message,
      });
      //console.log('Message saved to database:', newMessage);

      this.server.to(this.teamId.toString()).emit('message', {
        sender: this.userId, 
        message: payload.message,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Failed to save message:', error);
      client.emit('error', 'Failed to save message');
    }
  }
}
