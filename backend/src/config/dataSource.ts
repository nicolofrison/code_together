import 'dotenv/config';
import { DataSource } from 'typeorm';

const host = process.env.PGHOST;
const port = parseInt(process.env.PGPORT);
const username = process.env.PGUSER;
const password = process.env.PGPASSWORD;
const database = process.env.PGDATABASE;

export const appDataSource = new DataSource({
  type: 'postgres',
  host,
  port,
  username,
  password,
  database,
  entities: [`${__dirname}/../models/entities/**/*.{ts,js}`],
  migrations: [__dirname + '/../migrations/*{.ts,.js}']
});
