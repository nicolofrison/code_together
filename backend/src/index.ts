import 'dotenv/config';
import 'reflect-metadata';
import Server from './server';

// controllers instances
import { authControllerInstance } from './controllers/auth.controller';
import { appDataSource } from './config/dataSource';

(async () => {
  try {
    await appDataSource.initialize();
  } catch (error) {
    console.error('Error while connecting to the database', error);
    return error;
  }
  const app = new Server([authControllerInstance]);
  app.listen();

  return null;
})();
