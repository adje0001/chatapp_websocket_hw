import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Message } from '../messages/message.entity.js';
import { User } from '../users/user.entity.js';

@Entity('threads')
export class Thread {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // ONE-TO-MANY: en tråd har en liste af beskeder
  @OneToMany(() => Message, (message) => message.thread)
  messages: Relation<Message[]>;

  // MANY-TO-MANY (ejer-siden): en tråd har mange deltagere, og en user kan
  // være med i mange tråde. @JoinTable laver tabellen thread_participants
  @ManyToMany(() => User, (user) => user.threads)
  @JoinTable({
    name: 'thread_participants',
    joinColumn: { name: 'thread_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  participants: Relation<User[]>;
}
