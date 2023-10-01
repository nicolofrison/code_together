import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'love2code',
  database: 'code_together',
  synchronize: true,
  logging: false,
  entities: ['src/entities/**/*{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  subscribers: []
});
