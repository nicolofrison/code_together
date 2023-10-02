import HttpError from './HttpError';

export enum AuthenticationHttpErrorType {
  General,
  WrongAuthenticationToken,
  MissingOrWrongAuthenticationToken,
  ExpiredAuthenticationToken
}

export class AuthenticationHttpError extends HttpError {
  constructor(type: AuthenticationHttpErrorType) {
    switch (type) {
      case AuthenticationHttpErrorType.ExpiredAuthenticationToken:
        super(
          401,
          'The authentication token is expired',
          'expiredAuthenticationToken'
        );
        break;
      case AuthenticationHttpErrorType.General:
        super(401, 'Authentication error', 'authenticationError');
        break;
      case AuthenticationHttpErrorType.MissingOrWrongAuthenticationToken:
        super(
          401,
          'The authentication token is missing or wrong',
          'missingOrWrongAuthenticationToken'
        );
        break;
      case AuthenticationHttpErrorType.WrongAuthenticationToken:
        super(
          401,
          'The authentication token is wrong',
          'wrongAuthenticationToken'
        );
        break;
    }
  }
}
