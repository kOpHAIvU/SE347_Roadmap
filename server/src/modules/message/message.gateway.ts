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
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messageService: MessageService) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.server = server;
    console.log('WebSocket Gateway Initialized');
    console.log('Server is ready to accept connections');
  }

  handleConnection(client: Socket) {
    const teamId = client.handshake.query.teamId as string;
    const userId = client.handshake.query.userId as string;

    console.log('Client connected:', {
      clientId: client.id,
      teamId,
      userId,
    });

    if (!teamId || !userId) {
      console.error('Connection rejected: Missing teamId or userId', client.id);
      client.disconnect();
      return;
    }

    client.join(teamId);
    client.data.teamId = teamId;
    client.data.userId = userId;

    console.log(`Client ${client.id} joined team ${teamId}`);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', {
      clientId: client.id,
      teamId: client.data?.teamId,
      userId: client.data?.userId,
    });
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    client: Socket,
    @MessageBody() payload: { message: string }
  ): Promise<void> {
    if (!client.data || !client.data.teamId || !client.data.userId) {
      console.error('Invalid client data:', client.id, client.data);
      client.emit('error', 'Missing teamId or userId');
      return;
    }

    const { teamId, userId } = client.data;

    console.log('Received message:', {
      teamId,
      userId,
      message: payload.message,
    });

    if (!payload.message || payload.message.trim() === '') {
      console.error('Empty message received from client:', client.id);
      client.emit('error', 'Message cannot be empty');
      return;
    }

    try {
      const newMessage = await this.messageService.create({
        senderId: Number(userId),
        teamId: teamId,
        check: false,
        content: payload.message,
      });

      console.log('Message saved to database:', newMessage);

      this.server.to(teamId).emit('message', {
        sender: userId,
        message: payload.message,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Failed to save message:', error);
      client.emit('error', 'Failed to save message');
    }
  }
}
