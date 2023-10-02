/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import * as express from 'express';
import Controller from '../models/http/controller';
import { userService as userServiceInstance } from '../services/user.service';
import validationMiddleware from '../middlewares/validation.middleware';
import AuthPost from '../models/http/requests/authPost';
import ServerHttpError from '../models/http/errors/ServerHttpError';
import HttpError from '../models/http/errors/HttpError';
import RecordNotFoundError from '../models/exceptions/RecordNotFoundError';

class AuthController extends Controller {
  private static readonly PATH = '/auth';

  private userService = userServiceInstance;

  public constructor() {
    super();
    this.initRoutes();
  }

  protected initRoutes() {
    this.router.post(
      `${AuthController.PATH}/signup`,
      validationMiddleware(AuthPost),
      this.signUp
    );
  }

  private signUp = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const authData: AuthPost = request.body;

    try {
      const createdUser = await this.userService.createUser(authData);

      if (createdUser != null) {
        response.status(200);
        response.send(createdUser);
      }
    } catch (e) {
      if (e instanceof RecordNotFoundError) {
        next(new HttpError(400, e.message, ''));
      } else {
        console.error(e);
        next(new ServerHttpError());
      }
    }
  };
}

export default AuthController;
export const authControllerInstance = new AuthController();
