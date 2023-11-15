import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ModdedVehicle {
    @PrimaryColumn()
    spawnName: string;

    @Column()
    name: string;

    @Column()
    link: string;

    @Column()
    author: string;
}
