import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Thread } from '../threads/thread.entity.js';
import { User } from '../users/user.entity.js';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // MANY-TO-ONE: mange beskeder er skrevet af én user.
  // Fremmednøglen author_id ligger her. Slettes useren, slettes beskederne
  @ManyToOne(() => User, (user) => user.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: Relation<User>;

  // MANY-TO-ONE: mange beskeder hører til én tråd
  @ManyToOne(() => Thread, (thread) => thread.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'thread_id' })
  thread: Relation<Thread>;
}
