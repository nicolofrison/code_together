import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique
} from 'typeorm';
import User from './User';

@Entity()
@Unique(['ownerId', 'name'])
export default class Code {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true })
  name: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ nullable: false })
  ownerId: number;

  public constructor(name: string, ownerId: number) {
    this.name = name;
    this.ownerId = ownerId;
  }
}
