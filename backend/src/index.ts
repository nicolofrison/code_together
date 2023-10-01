import Server from './server';

// controllers instances
import { authControllerInstance } from './controllers/auth.controller';

(async () => {
  const app = new Server([authControllerInstance]);
  app.listen();

  return null;
})();
