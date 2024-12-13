import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ReportService } from './report.service';

@WebSocketGateway({
  namespace: "newReport",
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT']
  },
  transports: ['websocket'] 
})
export class ReportGateway 
            implements OnGatewayInit, 
            OnGatewayConnection, 
            OnGatewayDisconnect {

  constructor(
   // private readonly reportService: ReportService
  ) {}

  @WebSocketServer()
  server: Server;    
  
  afterInit(server: Server) {
    console.log('WebSocket Report Gateway Initialized');
    this.server = server;
  }

  handleConnection(client: Socket) {
    console.log('Client connected to websocket Report: ', {
      //clientId: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected Report :', {
      clientId: client.id,
    });
  }

  // @SubscribeMessage('report')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }


  sendNotificationToClients(report: string) {
    console.log("Report send", report)
    this.server.emit('SendReport', report); 
  }

}
