import HttpError from './HttpError';

export enum AuthenticationHttpErrorType {
  General,
  WrongAuthenticationToken,
  MissingOrWrongAuthenticationToken,
  ExpiredAuthenticationToken
}

export class AuthenticationHttpError extends HttpError {
  public readonly type: AuthenticationHttpErrorType;

  constructor(type: AuthenticationHttpErrorType) {
    switch (type) {
      case AuthenticationHttpErrorType.ExpiredAuthenticationToken:
        super(
          409,
          'The authentication token is expired',
          'expiredAuthenticationToken'
        );
        this.type = AuthenticationHttpErrorType.ExpiredAuthenticationToken;
        break;
      case AuthenticationHttpErrorType.General:
        super(401, 'Authentication error', 'authenticationError');
        this.type = AuthenticationHttpErrorType.General;
        break;
      case AuthenticationHttpErrorType.MissingOrWrongAuthenticationToken:
        super(
          401,
          'The authentication token is missing or wrong',
          'missingOrWrongAuthenticationToken'
        );
        this.type =
          AuthenticationHttpErrorType.MissingOrWrongAuthenticationToken;
        break;
      case AuthenticationHttpErrorType.WrongAuthenticationToken:
        super(
          401,
          'The authentication token is wrong',
          'wrongAuthenticationToken'
        );
        this.type = AuthenticationHttpErrorType.WrongAuthenticationToken;
        break;
    }
  }
}
