import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`Mobile/Web Connected to Noti: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected from Noti: ${client.id}`);
  }


  sendNotification(notiData: any) {
    this.server.emit('new_notification', notiData);
  }
}