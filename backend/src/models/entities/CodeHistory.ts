import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import Code from './Code';

@Entity()
export default class CodeHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Code)
  @JoinColumn({ name: 'codeId' })
  code: Code;

  @Column({ nullable: false })
  codeId: number;

  @Column({ nullable: false })
  comment: string;

  @Column({ nullable: false })
  commit_sha: string;

  @Column({ type: 'timestamptz' }) // Recommended
  timestamp: Date;
}
