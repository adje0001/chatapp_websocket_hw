import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { ChatModule } from './chat/chat.module.js';
import { MessagesModule } from './messages/messages.module.js';
import { ThreadsModule } from './threads/threads.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      // Alle entities registreret med forFeature() kommer automatisk med
      autoLoadEntities: true,
      // TypeORM laver og opdaterer tabellerne ud fra entities. Kun til udvikling
      synchronize: true,
    }),
    UsersModule,
    ThreadsModule,
    MessagesModule,
    ChatModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
