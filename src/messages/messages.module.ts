import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from '../chat/chat.module.js';
import { Thread } from '../threads/thread.entity.js';
import { User } from '../users/user.entity.js';
import { Message } from './message.entity.js';
import { MessagesController } from './messages.controller.js';
import { MessagesService } from './messages.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Thread]), ChatModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
