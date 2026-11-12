import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity.js';
import { Thread } from './thread.entity.js';
import { ThreadsController } from './threads.controller.js';
import { ThreadsService } from './threads.service.js';

@Module({
  // User er med, fordi servicen slår deltagere op
  imports: [TypeOrmModule.forFeature([Thread, User])],
  controllers: [ThreadsController],
  providers: [ThreadsService],
})
export class ThreadsModule {}
