import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway.js';

@Module({
  providers: [ChatGateway],
  // Eksporteres, så MessagesService kan sende nye beskeder ud
  exports: [ChatGateway],
})
export class ChatModule {}
