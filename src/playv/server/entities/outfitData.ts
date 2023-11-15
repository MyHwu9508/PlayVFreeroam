import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ConVar } from '../../shared/conf/ConVars';

@Entity()
export class OutfitData {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userID: number;

  @Column()
  profileName: string;

  @CreateDateColumn({ update: false })
  timestamp?: Date;

  @Column()
  female: boolean;

  @Column({ type: 'bigint', array: true })
  mask: [number, number];

  @Column({ type: 'bigint', array: true })
  torso: [number, number];

  @Column({ type: 'bigint', array: true })
  legs: [number, number];

  @Column({ type: 'bigint', array: true })
  bags: [number, number];

  @Column({ type: 'bigint', array: true })
  shoes: [number, number];

  @Column({ type: 'bigint', array: true })
  accessories: [number, number];

  @Column({ type: 'bigint', array: true })
  undershirt: [number, number];

  @Column({ type: 'bigint', array: true })
  armor: [number, number];

  @Column({ type: 'bigint', array: true })
  decals: [number, number];

  @Column({ type: 'bigint', array: true })
  shirts: [number, number];

  @Column({ type: 'bigint', array: true })
  hats: [number, number];

  @Column({ type: 'bigint', array: true })
  glasses: [number, number];

  @Column({ type: 'bigint', array: true })
  ears: [number, number];

  @Column({ type: 'bigint', array: true })
  watches: [number, number];

  @Column({ type: 'bigint', array: true })
  bracelets: [number, number];
}
