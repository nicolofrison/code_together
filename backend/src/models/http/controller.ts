import { Router } from 'express';

abstract class Controller {
  protected router = Router();

  protected constructor() {}

  protected abstract initRoutes(): void;

  public getRouter(): Router {
    return this.router;
  }
}

export default Controller;
