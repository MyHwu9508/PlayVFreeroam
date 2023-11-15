import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { LobbySettings } from '../../shared/types/lobby';

@Entity()
export class LobbyPreset {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ update: false })
  timeStamp: string;

  @Column()
  ownerID: number;

  @Column({ type: 'json' })
  lobbySettings: LobbySettings;

  @Column({ type: 'json' })
  permissions: string[];

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'json' })
  allowedWeapons: number[];

  @Column({ default: 0 })
  numUsed: number;
}
