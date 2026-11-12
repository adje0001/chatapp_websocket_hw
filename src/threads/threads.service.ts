import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../users/user.entity.js';
import { CreateThreadDto } from './dto/create-thread.dto.js';
import { UpdateThreadDto } from './dto/update-thread.dto.js';
import { Thread } from './thread.entity.js';

@Injectable()
export class ThreadsService {
  constructor(
    @InjectRepository(Thread)
    private threadsRepository: Repository<Thread>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<Thread[]> {
    return this.threadsRepository.find({
      relations: { participants: true },
      order: { id: 'ASC' },
    });
  }

  // Henter tråden med deltagere og alle beskeder (inkl. forfatter), ældste først
  async findOne(id: number): Promise<Thread> {
    const thread = await this.threadsRepository.findOne({
      where: { id },
      relations: { participants: true, messages: { author: true } },
      order: { messages: { createdAt: 'ASC' } },
    });
    if (!thread) throw new NotFoundException('Thread not found');
    return thread;
  }

  async create(createThreadDto: CreateThreadDto): Promise<Thread> {
    const participants = await this.findUsers(
      createThreadDto.participantIds ?? [],
    );
    const thread = this.threadsRepository.create({
      title: createThreadDto.title,
      participants,
    });
    const saved = await this.threadsRepository.save(thread);
    return this.findOne(saved.id);
  }

  async update(id: number, updateThreadDto: UpdateThreadDto): Promise<Thread> {
    const thread = await this.findWithParticipants(id);
    if (updateThreadDto.title !== undefined) {
      thread.title = updateThreadDto.title;
    }
    // Sendes participantIds med, erstattes hele listen af deltagere
    if (updateThreadDto.participantIds !== undefined) {
      thread.participants = await this.findUsers(
        updateThreadDto.participantIds,
      );
    }
    await this.threadsRepository.save(thread);
    return this.findOne(id);
  }

  // Sletter også trådens beskeder (onDelete: 'CASCADE' på Message.thread)
  async remove(id: number): Promise<Thread> {
    const thread = await this.findOne(id);
    await this.threadsRepository.delete(id);
    return thread;
  }

  async addParticipant(id: number, userId: number): Promise<Thread> {
    const thread = await this.findWithParticipants(id);
    const [user] = await this.findUsers([userId]);
    if (!thread.participants.some((p) => p.id === user.id)) {
      thread.participants.push(user);
      await this.threadsRepository.save(thread);
    }
    return this.findOne(id);
  }

  async removeParticipant(id: number, userId: number): Promise<Thread> {
    const thread = await this.findWithParticipants(id);
    thread.participants = thread.participants.filter((p) => p.id !== userId);
    await this.threadsRepository.save(thread);
    return this.findOne(id);
  }

  private async findWithParticipants(id: number): Promise<Thread> {
    const thread = await this.threadsRepository.findOne({
      where: { id },
      relations: { participants: true },
    });
    if (!thread) throw new NotFoundException('Thread not found');
    return thread;
  }

  // Slår users op ud fra id'er og fejler, hvis bare én ikke findes
  private async findUsers(ids: number[]): Promise<User[]> {
    const uniqueIds = [...new Set(ids)];
    if (uniqueIds.length === 0) return [];
    const users = await this.usersRepository.findBy({ id: In(uniqueIds) });
    if (users.length !== uniqueIds.length) {
      throw new NotFoundException('One or more users not found');
    }
    return users;
  }
}
