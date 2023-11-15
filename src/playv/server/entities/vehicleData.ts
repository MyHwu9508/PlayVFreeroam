import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, PrimaryColumn, ManyToMany, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import alt from 'alt-server';
import type { VehicleHandling } from '../../shared/types/vehicleHandling';
import { PUser } from './puser';
import { ConVar } from '../../shared/conf/ConVars';

@Entity()
export class VehicleData {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn({ update: false })
  timestamp?: Date;

  @Column()
  saveName: string;

  @Column({ type: 'bigint' })
  modelHash: number;

  @ManyToOne(() => PUser, user => user.userID)
  owner: Relation<PUser>;

  @Column({ type: 'boolean' })
  isPublic: boolean;

  @Column()
  modelName: string;

  @Column()
  pearlColor: number;

  @Column()
  primaryColor: number;

  @Column()
  secondaryColor: number;

  @Column({ type: 'boolean' })
  usingPrimaryRGB: boolean; //if player last used rgb > saved to prevent color issues when loading veh

  @Column({ type: 'boolean' })
  usingSecondaryRGB: boolean;

  @Column({ type: 'simple-json' })
  customPrimaryColor: alt.RGBA;

  @Column({ type: 'simple-json' })
  customSecondaryColor: alt.RGBA;

  @Column()
  customTires: boolean;

  @Column()
  dashboardColor: number;

  @Column()
  numberPlateIndex: number;

  @Column()
  numberPlateText: string;

  @Column()
  frontWheels: number;

  @Column()
  rearWheels: number;

  @Column()
  wheelType: number;

  @Column({ type: 'float', nullable: true })
  acceleratorModifier?: number;

  @Column({ nullable: true })
  modifiedTopSpeed?: number;

  @Column()
  headlightColor: number;

  @Column()
  interiorColor: number;

  @Column({ type: 'simple-json' })
  neonColor: alt.RGBA;

  @Column({ type: 'simple-json' })
  neon: { front: boolean; back: boolean; left: boolean; right: boolean };

  @Column({ type: 'float' })
  lightsMultiplier: number;

  @Column({ type: 'simple-json' })
  tireSmokeColor: alt.RGBA;

  @Column({})
  wheelColor: number;

  @Column({ type: 'boolean' })
  driftModeEnabled: boolean;

  @Column({})
  windowTint: number;

  @Column({ type: 'simple-json', default: [] })
  tuningParts?: number[][];

  @Column({ type: 'simple-array', default: [] })
  activeExtras?: number[];

  @Column({ nullable: true })
  customEngineSound?: string;

  @Column({ nullable: true, type: 'simple-json' })
  wheelStanceData?: [number[], number[], number[]];

  @Column({ nullable: true, type: 'simple-json' })
  handlingData?: VehicleHandling;
}
