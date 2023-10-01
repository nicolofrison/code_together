/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import * as express from 'express';
import Controller from '../models/interfaces/controller';
import { userService } from '../services/user.service';

class AuthController extends Controller {
  private static readonly PATH = '/auth';

  public userService = userService;

  public constructor() {
    super();
  }

  protected initRoutes() {
    this.router.post(`${AuthController.PATH}/signup`, this.signUp);
  }

  private async signUp(request: express.Request, response: express.Response) {
    response.send('Hello world');
  }
}

export default AuthController;
export const authControllerInstance = new AuthController();
