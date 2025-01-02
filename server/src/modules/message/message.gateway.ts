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
    client.data.teamId = this.teamId;
    client.data.userId = this.userId;

    console.log("Client information:", client.data);

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
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { message: string }
  ): Promise<void> {
    const userId = client.data.userId;
    const teamId = client.data.teamId;

    // console.log('Received message:', {
    //   teamId: client.data.teamId,
    //   userId :this.userId,
    //   message: payload.message,
    // });

    if (!payload.message || payload.message.trim() === '') {
      console.error('Empty message received from client:', client.id);
      client.emit('error', 'Message cannot be empty');
      return;
    }
    console.log("Sender Id: ",this.userId)
    try {
      const newMessage = await this.messageService.create({
        senderId: userId,
        teamId: teamId,
        check: false,
        content: payload.message,
      });
      // this.server.to(this.teamId.toString()).emit('message', {
      //   sender: this.userId, 
      //   message: payload.message,
      //   timestamp: new Date(),
      // });

      // this.server.to(this.teamId.toString())
      //           .emit('message', newMessage);
      //client.broadcast.to(this.teamId.toString()).emit('message', newMessage);
      client.broadcast.to(this.teamId.toString()).emit('message', {message: newMessage, senderId: userId});
    } catch (error) {
      console.log('Failed to delete message:', error.message);
      this.server.to(this.teamId.toString()).emit('error', {
        message: error.message,
        statusCode: 500,
        data: null
      });
    }
  }

  @SubscribeMessage('delete_message')
  async handleDeleteMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { message: string }
  ): Promise<void> {
    const messageId = Number(payload.message);
    try {
      const deletedMessage = await this.messageService.remove(messageId);
     // this.server.to(this.teamId.toString()).emit('message', deletedMessage);
     client.broadcast.to(this.teamId.toString()).emit('message', {message: deletedMessage, senderId: this.userId}); 
     console.log('Message deleted:', deletedMessage);
    } catch(error) {
      console.log('Failed to delete message:', error.message);
      this.server.to(this.teamId.toString()).emit('error', {
        message: error.message,
        statusCode: 500,
        data: null
      });
    }
  }

  @SubscribeMessage('update_message')
  async handleUpdateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { 
      id: number, 
      updateMessage: UpdateMessageDto
    }
  ): Promise<void> {
    try {
      const updateResponse = await this.messageService.update(payload.id, payload.updateMessage);
      if (updateResponse.statusCode !== 200) {
        this.server.to(this.teamId.toString()).emit('error', 'Failed to save message');
      }
      //this.server.to(this.teamId.toString()).emit('message', updateResponse);
      client.broadcast.to(this.teamId.toString()).emit('message', {message: updateResponse, senderId: this.userId});
    } catch(error) {
      console.log('Failed to delete message:', error.message);
      this.server.to(this.teamId.toString()).emit('error', {
        message: error.message,
        statusCode: 500,
        data: null
      });
    }
  }

}
