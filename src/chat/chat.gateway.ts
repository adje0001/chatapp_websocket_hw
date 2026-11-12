import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import type { Message } from '../messages/message.entity.js';

// Lytter på samme port som HTTP-serveren (3000)
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  // Klienten følger en tråd: socket.emit('joinThread', 1)
  @SubscribeMessage('joinThread')
  async joinThread(
    @MessageBody() threadId: number,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(this.room(threadId));
    return { event: 'joinedThread', data: Number(threadId) };
  }

  // Klienten stopper med at følge en tråd: socket.emit('leaveThread', 1)
  @SubscribeMessage('leaveThread')
  async leaveThread(
    @MessageBody() threadId: number,
    @ConnectedSocket() client: Socket,
  ) {
    await client.leave(this.room(threadId));
    return { event: 'leftThread', data: Number(threadId) };
  }

  // Kaldes af MessagesService, når en ny besked er gemt i databasen
  emitNewMessage(message: Message) {
    this.server.to(this.room(message.thread.id)).emit('newMessage', message);
  }

  // Hver tråd har sit eget socket.io-"room"
  private room(threadId: number) {
    return `thread-${Number(threadId)}`;
  }
}
