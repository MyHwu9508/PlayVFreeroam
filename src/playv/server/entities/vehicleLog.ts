import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class VehicleLog {
  @PrimaryGeneratedColumn()
  index: number;

  @CreateDateColumn({ update: false })
  timeStamp: string;

  @Column()
  userID: number;

  @Column({ nullable: true })
  vehicleModel: string;

  @Column({ nullable: true })
  customVehicleID: number;
}
