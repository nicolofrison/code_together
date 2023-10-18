/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import * as express from 'express';
import Controller from '../models/http/controller';
import { codeHistoryService as codeHistoryServiceInstance } from '../services/codeHistory.service';
import ServerHttpError from '../models/http/errors/ServerHttpError';
import HttpError from '../models/http/errors/HttpError';
import RecordNotFoundError from '../models/exceptions/RecordNotFoundError';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../models/http/requests/requestWithUser.interface';
import { param, query } from 'express-validator';
import { codeService } from '../services/code.service';
import validationMiddleware from '../middlewares/validation.middleware';
import CodeHistoryPost from '../models/http/requests/codeHistoryPost';
import RecordNotAuthorizedError from '../models/exceptions/RecordNotAuthorizedError';
import NotLastCodeHistoryError from '../models/exceptions/NotLastCodeHistoryError';

class CodeHistoryController extends Controller {
  private static readonly PATH = '/codeHistories';

  private codeHistoryService = codeHistoryServiceInstance;

  public constructor() {
    super();
    this.initRoutes();
  }

  private async queryCodeIdMiddleware(
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) {
    const codeId = request.query.codeId as string;
    if (
      new RegExp('^[1-9]d*$').test(codeId) &&
      ((x) => (x | 0) === x)(parseFloat(codeId))
    ) {
      next();
    } else {
      next(
        new HttpError(400, 'The codeId as query param is a required number', '')
      );
    }
  }

  protected initRoutes() {
    this.router
      .all(`${CodeHistoryController.PATH}`, authMiddleware)
      .get(
        `${CodeHistoryController.PATH}`,
        this.queryCodeIdMiddleware,
        this.findAll
      )
      .post(
        `${CodeHistoryController.PATH}`,
        validationMiddleware(CodeHistoryPost),
        this.create
      )
      .all(`${CodeHistoryController.PATH}/:id`, authMiddleware)
      .get(
        `${CodeHistoryController.PATH}/:id`,
        param('id').isInt(),
        this.findById
      )
      .delete(
        `${CodeHistoryController.PATH}/:id`,
        param('id').isInt(),
        this.delete
      );
  }

  private findAll = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const codeId = +request.query.codeId;

    try {
      const codeHistories = await this.codeHistoryService.findAll(codeId);
      response.status(200);
      response.send(codeHistories);
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
    const codeHistoryId = +request.params.id;

    try {
      const codeHistory = await this.codeHistoryService.findById(codeHistoryId);
      response.status(200);
      response.send(codeHistory);
    } catch (e) {
      if (e instanceof RecordNotFoundError) {
        next(new HttpError(404, e.message, ''));
      } else {
        console.error(e);
        next(new ServerHttpError());
      }
    }
  };

  private create = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const codeHistoryData: CodeHistoryPost = request.body;

    try {
      const codeHistory = await this.codeHistoryService.create(
        request.user.id,
        codeHistoryData
      );
      response.status(200);
      response.send(codeHistory);
    } catch (e) {
      if (e instanceof RecordNotFoundError) {
        next(new HttpError(400, e.message, ''));
      } else if (e instanceof RecordNotAuthorizedError) {
        next(new HttpError(403, e.message, ''));
      } else {
        console.error(e);
        next(new ServerHttpError());
      }
    }
  };

  private delete = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const codeHistoryId = +request.params.id;

    try {
      await this.codeHistoryService.delete(request.user.id, codeHistoryId);
      response.status(200);
      response.send();
    } catch (e) {
      if (e instanceof RecordNotFoundError) {
        next(new HttpError(404, e.message, ''));
      } else if (e instanceof NotLastCodeHistoryError) {
        next(new HttpError(400, e.message, ''));
      } else if (e instanceof RecordNotAuthorizedError) {
        next(new HttpError(403, e.message, ''));
      } else {
        console.error(e);
        next(new ServerHttpError());
      }
    }
  };
}

export default CodeHistoryController;
export const codeHistoryControllerInstance = new CodeHistoryController();
