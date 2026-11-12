import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatGateway } from '../chat/chat.gateway.js';
import { Thread } from '../threads/thread.entity.js';
import { User } from '../users/user.entity.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { UpdateMessageDto } from './dto/update-message.dto.js';
import { Message } from './message.entity.js';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Thread)
    private threadsRepository: Repository<Thread>,
    private chatGateway: ChatGateway,
  ) {}

  findAll(threadId?: number): Promise<Message[]> {
    return this.messagesRepository.find({
      where: threadId ? { thread: { id: threadId } } : {},
      relations: { author: true, thread: true },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id },
      relations: { author: true, thread: true },
    });
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const author = await this.usersRepository.findOneBy({
      id: createMessageDto.authorId,
    });
    if (!author) throw new NotFoundException('Author not found');

    const thread = await this.threadsRepository.findOne({
      where: { id: createMessageDto.threadId },
      relations: { participants: true },
    });
    if (!thread) throw new NotFoundException('Thread not found');

    // Skriver man i en tråd, bliver man automatisk deltager i den
    if (!thread.participants.some((p) => p.id === author.id)) {
      thread.participants.push(author);
      await this.threadsRepository.save(thread);
    }

    const message = this.messagesRepository.create({
      content: createMessageDto.content,
      author,
      thread,
    });
    const saved = await this.messagesRepository.save(message);
    const fullMessage = await this.findOne(saved.id);

    // Send beskeden live til alle, der følger tråden via WebSocket
    this.chatGateway.emitNewMessage(fullMessage);
    return fullMessage;
  }

  async update(
    id: number,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const message = await this.findOne(id);
    message.content = updateMessageDto.content;
    await this.messagesRepository.save(message);
    return this.findOne(id);
  }

  async remove(id: number): Promise<Message> {
    const message = await this.findOne(id);
    await this.messagesRepository.delete(id);
    return message;
  }
}
