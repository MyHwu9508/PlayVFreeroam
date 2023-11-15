import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ChatLog {
  @PrimaryGeneratedColumn()
  index: number;

  @CreateDateColumn({ update: false })
  timeStamp: string;

  @Column()
  senderID: number;

  @Column()
  range: string;

  @Column()
  dimension: number;

  @Column()
  message: string;
}
