/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import * as express from 'express';
import Controller from '../models/http/controller';
import { codeService as codeServiceInstance } from '../services/code.service';
import ServerHttpError from '../models/http/errors/ServerHttpError';
import HttpError from '../models/http/errors/HttpError';
import RecordNotFoundError from '../models/exceptions/RecordNotFoundError';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../models/http/requests/requestWithUser.interface';
import { param } from 'express-validator';
import { gitService } from '../services/git.service';
import CodeWithText from '../models/http/responses/codeWithText.interface';

class CodeController extends Controller {
  private static readonly PATH = '/codes';

  private codeService = codeServiceInstance;

  public constructor() {
    super();
    this.initRoutes();
  }

  protected initRoutes() {
    this.router
      .all(`${CodeController.PATH}`, authMiddleware)
      .all(`${CodeController.PATH}/:id`, authMiddleware)
      .get(`${CodeController.PATH}`, this.findAll)
      .get(`${CodeController.PATH}/:id`, param('id').isInt(), this.findById);
  }

  private findAll = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const codes = await this.codeService.findAll(request.user.id);
      response.status(200);
      response.send(codes);
    } catch (e) {
      console.error(e);
      next(new ServerHttpError());
    }
  };

  private findById = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const codeId = +request.params.id;

    try {
      const code: CodeWithText = await this.codeService.findById(codeId);

      code.text = await gitService.getCode(code.name, code.name);

      response.status(200);
      response.send(code);
    } catch (e) {
      if (e instanceof RecordNotFoundError) {
        next(new HttpError(404, e.message, ''));
      } else {
        console.error(e);
        next(new ServerHttpError());
      }
    }
  };
}

export default CodeController;
export const codeControllerInstance = new CodeController();
