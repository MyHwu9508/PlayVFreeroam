import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { VehicleData } from './vehicleData';

@Entity()
export class PUser {
  @PrimaryGeneratedColumn()
  userID: number;

  @Column({ nullable: true })
  discordID: string;

  @Column({ nullable: true })
  cloudID: string;

  @Column()
  socialID: string;

  @Column()
  socialClubName: string;

  @Column()
  altVUsername: string;

  @Column()
  username: string;

  @Column({ default: false })
  isMuted: boolean;

  @Column({ nullable: true, length: 30 })
  lastIP: string;

  @Column()
  loginCount: number;

  @Column('text', { array: true, default: [] })
  lastUsernames: string[];

  @Column({ default: new Date(1970, 1, 1) })
  lastUsernameChange: Date;

  @UpdateDateColumn()
  lastSeen: Date;

  @CreateDateColumn({ update: false })
  firstSeen: Date;

  @Column()
  playtimeMinutes: number;

  @Column({ default: 0 })
  authlevel: number;

  @Column({ default: 0 })
  warns: number;

  @Column({ nullable: true })
  banReason: string;

  @Column({ nullable: true })
  isBannedUntil: Date;

  @OneToMany(() => VehicleData, vehicle => vehicle.owner) //TODO relations are garbage, needs change
  ownVehicles: Relation<VehicleData>[];

  @Column({ nullable: true })
  lastCharacterID: number;

  @Column({ nullable: true })
  lastOutfitIDM: number;

  @Column({ nullable: true })
  lastOutfitIDF: number;

  @Column({ nullable: true })
  lastTattooID: string;
}
