import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { NoteType } from '../../shared/types/types';
import type { ColorName } from 'chalk';

@Entity()
export class PlayerLog {
  @PrimaryGeneratedColumn()
  index: number;

  @CreateDateColumn({ update: false })
  timeStamp: string;

  @Column()
  userID: number;

  @Column({ type: 'text' })
  type: NoteType;

  @Column({ type: 'text' })
  color: ColorName;

  @Column()
  text: string;

  @Column()
  executor: number;
}
