import {
  ConnectedSocket,
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
import { UpdateMessageDto } from './dto/update-message.dto';

@WebSocketGateway({
  namespace: '/message',
  cors: {
    origin: true,
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
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
  }

  handleConnection(client: Socket) {
    const teamId = Number(client.handshake.query.teamId as string);
    const userId = Number(client.handshake.query.userId as string);

    if (!teamId || !userId) {
      console.error('Connection rejected: Missing teamId or userId', client.id);
      client.disconnect();
      return;
    }

    // Lưu thông tin riêng vào `client.data`
    client.data.teamId = teamId;
    client.data.userId = userId;

    console.log('Client connected:', {
      clientId: client.id,
      teamId: client.data.teamId,
      userId: client.data.userId,
    });

    // Thêm client vào phòng (room) theo `teamId`
    client.join(client.data.teamId.toString());
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
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { message: string },
  ): Promise<void> {
    const userId = client.data.userId;
    const teamId = client.data.teamId;

    if (!payload.message || payload.message.trim() === '') {
      console.error('Empty message received from client:', client.id);
      client.emit('error', 'Message cannot be empty');
      return;
    }

    console.log('Sender Id:', userId);

    try {
      const newMessage = await this.messageService.create({
        senderId: userId,
        teamId: teamId,
        check: false,
        content: payload.message,
      });

      client.broadcast.to(teamId.toString()).emit('message', {
        message: newMessage,
        senderId: userId,
      });
    } catch (error) {
      console.log('Failed to send message:', error.message);
      client.emit('error', {
        message: error.message,
        statusCode: 500,
        data: null,
      });
    }
  }

  @SubscribeMessage('delete_message')
  async handleDeleteMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { messageId: number },
  ): Promise<void> {
    const userId = client.data.userId;
    const teamId = client.data.teamId;

    try {
      const deletedMessage = await this.messageService.remove(payload.messageId);

      client.broadcast.to(teamId.toString()).emit('message_deleted', {
        message: deletedMessage,
        senderId: userId,
      });

      console.log('Message deleted:', deletedMessage);
    } catch (error) {
      console.log('Failed to delete message:', error.message);
      client.emit('error', {
        message: error.message,
        statusCode: 500,
        data: null,
      });
    }
  }

  @SubscribeMessage('update_message')
  async handleUpdateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { id: number; updateMessage: UpdateMessageDto },
  ): Promise<void> {
    const userId = client.data.userId;
    const teamId = client.data.teamId;

    try {
      const updatedMessage = await this.messageService.update(
        payload.id,
        payload.updateMessage,
      );

      if (!updatedMessage) {
        client.emit('error', {
          message: 'Failed to update message',
          statusCode: 500,
          data: null,
        });
        return;
      }

      client.broadcast.to(teamId.toString()).emit('message_updated', {
        message: updatedMessage,
        senderId: userId,
      });

      console.log('Message updated:', updatedMessage);
    } catch (error) {
      console.log('Failed to update message:', error.message);
      client.emit('error', {
        message: error.message,
        statusCode: 500,
        data: null,
      });
    }
  }
}
