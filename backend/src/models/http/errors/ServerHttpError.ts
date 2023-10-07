import HttpError from './HttpError';

export default class ServerHttpError extends HttpError {
  constructor() {
    super(500, 'Internal server error', 'internalServerError');
  }
}
