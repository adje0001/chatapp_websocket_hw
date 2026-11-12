import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Message } from '../messages/message.entity.js';
import { Thread } from '../threads/thread.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // ONE-TO-MANY: én user skriver mange beskeder
  @OneToMany(() => Message, (message) => message.author)
  messages: Relation<Message[]>;

  // MANY-TO-MANY (den inverse side): en user deltager i mange tråde.
  // @JoinTable står på Thread, så join-tabellen ejes derfra
  @ManyToMany(() => Thread, (thread) => thread.participants)
  threads: Relation<Thread[]>;
}
