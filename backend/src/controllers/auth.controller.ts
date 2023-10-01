import { Express, Request, Response } from 'express';
import { userService } from '../services/user.service';
import BaseController from './baseController';

class AuthController extends BaseController {
  private userService = userService;

  public static init(app: Express) {
    this.instance = new AuthController(app);
    return this.instance;
  }

  protected constructor(app: Express) {
    super(app);
    this.app.get('/auth/signin', this.signUp);
    this.app.get('/auth/signup', this.signUp);
  }

  private signUp(req: Request, res: Response) {
    res.send('Hello world!');
  }

  private signIn(req: Request, res: Response) {
    res.send('Hello world!');
  }
}

export default AuthController;
