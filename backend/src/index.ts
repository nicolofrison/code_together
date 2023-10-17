import 'dotenv/config';
import 'reflect-metadata';
import Server from './server';

import { appDataSource } from './config/dataSource';

// controllers instances
import { authControllerInstance } from './controllers/auth.controller';
import { codeControllerInstance } from './controllers/code.controller';

(async () => {
  try {
    await appDataSource.initialize();
  } catch (error) {
    console.error('Error while connecting to the database', error);
    return error;
  }
  const app = new Server([authControllerInstance, codeControllerInstance]);
  app.listen();

  return null;
})();
