import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'love2code',
  database: 'code_together',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: []
});
