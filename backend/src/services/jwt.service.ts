import User from '../models/entities/User';
import {
  AuthenticationHttpError,
  AuthenticationHttpErrorType as AuthErrorType
} from '../models/http/errors/AuthenticationHttpError';
import { DataStoredInToken } from '../models/http/jwt.interface';
import { userService as userServiceInstance } from './user.service';
import * as jwt from 'jsonwebtoken';

class JwtService {
  private userService = userServiceInstance;
  private readonly secret = process.env.JWT_SECRET;
  private readonly expiresIn = +process.env.JWT_EXPIRATION; // in seconds

  public async authenticate(authorization: string): Promise<User> {
    try {
      const verificationResponse = jwt.verify(
        authorization,
        this.secret
      ) as DataStoredInToken;
      const { id } = verificationResponse.user;

      const user = await this.userService.findById(id);
      if (user) {
        return user;
      } else {
        throw new AuthenticationHttpError(
          AuthErrorType.WrongAuthenticationToken
        );
      }
    } catch (error) {
      const jwtError = error as jwt.JsonWebTokenError;
      if (!jwtError) {
        throw new AuthenticationHttpError(AuthErrorType.General);
      }
      throw jwtError.name === 'TokenExpiredError'
        ? new AuthenticationHttpError(AuthErrorType.ExpiredAuthenticationToken)
        : new AuthenticationHttpError(AuthErrorType.WrongAuthenticationToken);
    }
  }

  public createToken(user: User): string {
    const dataStoredInToken: DataStoredInToken = {
      user
    };

    return jwt.sign(dataStoredInToken, this.secret, {
      expiresIn: this.expiresIn
    });
  }
}

export default JwtService;
export const jwtService = new JwtService();
