/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import * as express from 'express';
import * as cors from 'cors';
import Controller from './models/http/controller';
import errorMiddleware from './middlewares/error.middleware';
import WebSocketService from './services/webSocket.service';

class Server {
  public app: express.Application;

  private port = process.env.PORT;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initPreRequestMiddlewares();
    this.initControllers(controllers);
    this.initPostRequestMiddlewares();
  }

  private initPreRequestMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private initControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.getRouter());
    });
  }

  private initPostRequestMiddlewares() {
    this.app.use(errorMiddleware);
  }

  public listen() {
    const webServer = this.app.listen(this.port, () => {
      console.info(`App listening on the port ${this.port}`);
    });

    WebSocketService.getInstance(webServer).init();
  }
}

export default Server;
