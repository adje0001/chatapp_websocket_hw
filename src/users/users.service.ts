import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { messages: true, threads: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.ensureUsernameIsFree(createUserDto.username);
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      await this.ensureUsernameIsFree(updateUserDto.username);
    }
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  // Sletter også userens beskeder (onDelete: 'CASCADE' på Message.author)
  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    await this.usersRepository.delete(id);
    return user;
  }

  private async ensureUsernameIsFree(username: string) {
    const existing = await this.usersRepository.findOneBy({ username });
    if (existing) throw new ConflictException('Username is already taken');
  }
}
