/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';

import HttpError from '../models/http/errors/HttpError';

/**
 * Errors middleware to call after the initialization of the controllers called only if exception passed to "next" function in the cycle steps before this one
 * @param error
 * @param request
 * @param response
 * @param next
 */
function errorMiddleware(
  error: HttpError,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  const translationKey = error.translationKey;

  response.status(status).json({
    status,
    message,
    translationKey
  });
}

export default errorMiddleware;
