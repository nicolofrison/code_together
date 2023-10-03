/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import * as express from 'express';
import Controller from '../models/http/controller';
import { userService as userServiceInstance } from '../services/user.service';
import validationMiddleware from '../middlewares/validation.middleware';
import AuthPost from '../models/http/requests/authPost';
import ServerHttpError from '../models/http/errors/ServerHttpError';
import HttpError from '../models/http/errors/HttpError';
import RecordNotFoundError from '../models/exceptions/RecordNotFoundError';
import WrongPasswordError from '../models/exceptions/WrongPasswordError';
import RecordAlreadyExistsError from '../models/exceptions/RecordAlreadyExistsError';
import { jwtService } from '../services/jwt.service';
import UserWithTokenResponse from '../models/http/responses/userWithToken.interface';

class AuthController extends Controller {
  private static readonly PATH = '/auth';

  private userService = userServiceInstance;

  public constructor() {
    super();
    this.initRoutes();
  }

  protected initRoutes() {
    this.router
      .post(
        `${AuthController.PATH}/signup`,
        validationMiddleware(AuthPost),
        this.signUp
      )
      .post(
        `${AuthController.PATH}/signin`,
        validationMiddleware(AuthPost),
        this.signIn
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
      if (
        e instanceof RecordNotFoundError ||
        e instanceof RecordAlreadyExistsError
      ) {
        next(new HttpError(400, e.message, ''));
      } else {
        console.error(e);
        next(new ServerHttpError());
      }
    }
  };

  private signIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const authData: AuthPost = request.body;

    try {
      const user = await this.userService.signIn(authData);

      if (user != null) {
        const token = jwtService.createToken(user);
        const userWithToken = {
          ...user,
          accessToken: token
        } as UserWithTokenResponse;

        response.status(200);
        response.send(userWithToken);
      }
    } catch (e) {
      if (e instanceof RecordNotFoundError || e instanceof WrongPasswordError) {
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
