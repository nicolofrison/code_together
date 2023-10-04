import 'dotenv/config';
import JwtService, { jwtService } from '../../src/services/jwt.service';
import * as jwt from 'jsonwebtoken';
import { userService } from '../../src/services/user.service';
import {
  AuthenticationHttpError,
  AuthenticationHttpErrorType
} from '../../src/models/http/errors/AuthenticationHttpError';

describe('JwtService', () => {
  describe('createToken', () => {
    test('createToken successfull', async () => {
      const expectedUser = { id: 1, email: 'email', password: 'password' };
      const token = jwtService.createToken(expectedUser);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.user).toStrictEqual(expectedUser);
    });
  });

  describe('authenticate', () => {
    jest.mock('../../src/services/user.service', () => jest.fn());

    let originalEnv;
    beforeAll(() => {
      originalEnv = process.env;
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    test('authenticate successfull', async () => {
      const expectedUser = {
        id: 1,
        email: 'email',
        password: 'hashedPassword'
      };

      userService.findById = jest.fn(() => Promise.resolve(expectedUser));

      const token = jwtService.createToken(expectedUser);
      const user = await jwtService.authenticate(token);

      expect(user).toStrictEqual(expectedUser);
    });

    test('authenticate invalid jwt token throws AuthenticationHttpError of type MissingOrWrongAuthenticationToken', async () => {
      try {
        await jwtService.authenticate('invalidToken');
        throw new Error(
          'The authenticate should throw AuthenticationHttpErrorType'
        );
      } catch (e) {
        expect(e).toBeInstanceOf(AuthenticationHttpError);
        expect(e.type).toBe(
          AuthenticationHttpErrorType.MissingOrWrongAuthenticationToken
        );
      }
    });

    test('authenticate valid jwt token with different secret throws AuthenticationHttpError of type WrongAuthenticationToken', async () => {
      const notExpectedUser = {
        id: 1,
        email: 'email',
        password: 'hashedPassword'
      };

      userService.findById = jest.fn(() => Promise.resolve(null));

      process.env.JWT_SECRET = 'differentSecret';
      const token = jwtService.createToken(notExpectedUser);
      process.env.JWT_SECRET = originalEnv.JWT_SECRET;
      try {
        await jwtService.authenticate(token);
        throw new Error(
          'The authenticate should throw AuthenticationHttpErrorType'
        );
      } catch (e) {
        expect(e).toBeInstanceOf(AuthenticationHttpError);
        expect(e.type).toBe(
          AuthenticationHttpErrorType.WrongAuthenticationToken
        );
      }
    });

    test('authenticate valid jwt token with invalid user id throws AuthenticationHttpError of type WrongAuthenticationToken', async () => {
      const notExpectedUser = {
        id: 1,
        email: 'email',
        password: 'hashedPassword'
      };

      userService.findById = jest.fn(() => Promise.resolve(null));

      const token = jwtService.createToken(notExpectedUser);
      try {
        await jwtService.authenticate(token);
        throw new Error(
          'The authenticate should throw AuthenticationHttpErrorType'
        );
      } catch (e) {
        expect(e).toBeInstanceOf(AuthenticationHttpError);
        expect(e.type).toBe(
          AuthenticationHttpErrorType.WrongAuthenticationToken
        );
      }
    });

    test('authenticate expired jwt token throws AuthenticationHttpError of type ExpiredAuthenticationToken', async () => {
      const notExpectedUser = {
        id: 1,
        email: 'email',
        password: 'hashedPassword'
      };

      process.env.JWT_EXPIRATION = '0';
      const createTokenJwtService = new JwtService();
      process.env.JWT_EXPIRATION = originalEnv.JWT_EXPIRATION;
      const authenticateJwtService = new JwtService();

      const token = createTokenJwtService.createToken(notExpectedUser);
      try {
        await authenticateJwtService.authenticate(token);
        throw new Error(
          'The authenticate should throw AuthenticationHttpErrorType'
        );
      } catch (e) {
        expect(e).toBeInstanceOf(AuthenticationHttpError);
        expect(e.type).toBe(
          AuthenticationHttpErrorType.ExpiredAuthenticationToken
        );
      }
    });
  });
});
