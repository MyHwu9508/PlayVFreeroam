import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class CharacterData {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userID: number;

  @Column()
  profileName: string;

  @CreateDateColumn({ update: false })
  timestamp?: Date;

  @Column({ type: 'jsonb' })
  headBlendData: {
    shapeFirst: number;
    shapeSecond: number;
    shapeThird: number;
    skinFirst: number;
    skinSecond: number;
    skinThird: number;
    shapeMix: number;
    skinMix: number;
    thirdMix: number;
  };

  @Column({ type: 'double precision', array: true })
  faceFeature: number[];

  @Column({ type: 'jsonb' })
  headOverlays: {
    index: number;
    opacity: number;
    colorID: number;
    secondColorID: number;
  }[];

  @Column({ type: 'boolean' })
  overrideMakeupColor: boolean;

  @Column({ type: 'integer' })
  eyeColor: number;

  @Column({ type: 'jsonb' })
  hairColor: {
    colorID: number;
    highlightColorID: number;
  };

  @Column({ type: 'boolean' })
  female: boolean;

  @Column({ type: 'integer' })
  hairIndex: number;

  @Column({ type: 'bigint', array: true, nullable: true })
  overlays?: [number, number][];
}
