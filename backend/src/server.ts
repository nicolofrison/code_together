/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import * as express from 'express';
import Controller from './models/http/controller';

class Server {
  public app: express.Application;

  private port = 8080;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initPreRequestMiddlewares();
    this.initControllers(controllers);
    this.initPostRequestMiddlewares();
  }

  private initPreRequestMiddlewares() {
    this.app.use(express.json());
  }

  private initControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.getRouter());
    });
  }

  private initPostRequestMiddlewares() {}

  public listen() {
    this.app.listen(this.port, () => {
      console.info(`App listening on the port ${this.port}`);
    });
  }
}

export default Server;
