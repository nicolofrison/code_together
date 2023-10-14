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
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../models/http/requests/requestWithUser.interface';
import WebSocketService from '../services/webSocket.service';

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
      )
      .get(`${AuthController.PATH}/wscode`, authMiddleware, this.createWsCode);
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
      if (e instanceof RecordAlreadyExistsError) {
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

  private createWsCode = async (
    request: RequestWithUser,
    response: express.Response
  ) => {
    const wsCodeNumberFormat = new Intl.NumberFormat('en-US', {
      minimumIntegerDigits: 6,
      useGrouping: false
    });

    let defaultWsCode = '';

    do {
      defaultWsCode = wsCodeNumberFormat.format(
        Math.floor(Math.random() * 999999) + 1
      );
    } while (WebSocketService.getInstance().isWsCodeUsed(defaultWsCode));

    response.status(200);
    response.send({ wsCode: defaultWsCode });
  };
}

export default AuthController;
export const authControllerInstance = new AuthController();
