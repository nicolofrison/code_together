import { NextFunction, Response } from 'express';
import RequestWithUser from '../models/http/requests/requestWithUser.interface';
import { jwtService } from '../services/jwt.service';

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const { headers } = request;
  const authorization = headers?.authorization?.replace('Bearer ', '');
  try {
    const user = await jwtService.authenticate(authorization);
    request.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export default authMiddleware;
