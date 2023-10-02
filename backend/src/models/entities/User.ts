import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar')
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
