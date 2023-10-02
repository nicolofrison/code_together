import { DataSource } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'love2code',
  database: 'code_together',
  entities: [`${__dirname}/../models/entities/**/*.{ts,js}`],
  migrations: [__dirname + '/../migrations/*{.ts,.js}']
});
