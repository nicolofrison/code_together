import { Express } from 'express';

export default abstract class BaseController {
  protected static instance: BaseController;
  protected app: Express;

  protected constructor(app: Express) {
    this.app = app;
  }
}
