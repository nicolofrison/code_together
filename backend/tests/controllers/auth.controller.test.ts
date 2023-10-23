import 'dotenv/config';
import { userService } from '../../src/services/user.service';
import request = require('supertest');
import Server from '../../src/server';
import { authControllerInstance } from '../../src/controllers/auth.controller';
import User from '../../src/models/entities/User';
import RecordAlreadyExistsError from '../../src/models/exceptions/RecordAlreadyExistsError';
import { TypeORMError } from 'typeorm';
import RecordNotFoundError from '../../src/models/exceptions/RecordNotFoundError';
import WrongPasswordError from '../../src/models/exceptions/WrongPasswordError';
import WebSocketService from '../../src/services/webSocket.service';

describe('AuthController', () => {
  jest.mock('../../src/services/user.service', () => jest.fn());
  jest.mock('../../src/services/webSocket.service', () => jest.fn());

  describe('signIn', () => {
    const apiUrl = '/auth/signin';
    const server = new Server([authControllerInstance]);

    test('sign in a user successfully without last code history', async () => {
      const req = { email: 'email', password: 'password' };
      const expectedUser = {
        email: req.email,
        id: 1
      };
      userService.signIn = userService.findById = jest.fn(() =>
        Promise.resolve(expectedUser as User)
      );

      const expectedWsCode = 133456;
      const mockStaticGetInstance = jest.fn().mockReturnValue({
        generateUniqueWsCode: () => expectedWsCode
      });

      WebSocketService.getInstance = mockStaticGetInstance;

      const response = await request(server.app).post(apiUrl).send(req);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(expectedUser);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('wsCode', expectedWsCode);
    });

    test('sign in a user successfully with last code history', async () => {
      const req = { email: 'email', password: 'password' };
      const expectedUser = {
        email: req.email,
        id: 1
      } as User;

      userService.signIn = userService.findById = jest.fn(() =>
        Promise.resolve(expectedUser as User)
      );

      const expectedWsCode = 133456;
      const mockStaticGetInstance = jest.fn().mockReturnValue({
        generateUniqueWsCode: () => expectedWsCode
      });

      WebSocketService.getInstance = mockStaticGetInstance;

      const response = await request(server.app).post(apiUrl).send(req);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(expectedUser);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('wsCode', expectedWsCode);
    });

    test('sign in a user with wrong request body response 400', async () => {
      const server = new Server([authControllerInstance]);

      const req = {};

      const response = await request(server.app).post(apiUrl).send(req);
      expect(response.statusCode).toBe(400);
    });

    test('sign in a user with non existent email response 400', async () => {
      const server = new Server([authControllerInstance]);

      const req = { email: 'email', password: 'password' };
      userService.signIn = jest.fn(() =>
        Promise.reject(new RecordNotFoundError(User.name, 'email'))
      );

      const response = await request(server.app).post(apiUrl).send(req);
      expect(response.statusCode).toBe(400);
    });

    test('sign in a user with wrong password response 400', async () => {
      const server = new Server([authControllerInstance]);

      const req = { email: 'email', password: 'password' };
      userService.signIn = jest.fn(() =>
        Promise.reject(new WrongPasswordError())
      );

      const response = await request(server.app).post(apiUrl).send(req);
      expect(response.statusCode).toBe(400);
    });

    test('sign in db error response 500', async () => {
      const server = new Server([authControllerInstance]);

      const req = { email: 'email', password: 'password' };
      userService.signIn = jest.fn(() => Promise.reject(new TypeORMError()));

      const response = await request(server.app).post(apiUrl).send(req);
      expect(response.statusCode).toBe(500);
    });
  });

  describe('signUp', () => {
    const apiUrl = '/auth/signup';
    const server = new Server([authControllerInstance]);

    test('sign up a new user successfully', async () => {
      const req = { email: 'email', password: 'password' };
      const expectedUser = { email: req.email, id: 1 };
      userService.createUser = jest.fn(() =>
        Promise.resolve(expectedUser as User)
      );

      const response = await request(server.app).post(apiUrl).send(req);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(expectedUser);
    });

    test('sign up a user with an already existing email response 400', async () => {
      const server = new Server([authControllerInstance]);

      const req = { email: 'email', password: 'password' };
      userService.createUser = jest.fn(() =>
        Promise.reject(new RecordAlreadyExistsError(User.name, 'email'))
      );

      const response = await request(server.app).post(apiUrl).send(req);
      expect(response.statusCode).toBe(400);
    });

    test('sign up db error response 500', async () => {
      const server = new Server([authControllerInstance]);

      const req = { email: 'email', password: 'password' };
      userService.createUser = jest.fn(() =>
        Promise.reject(new TypeORMError())
      );

      const response = await request(server.app).post(apiUrl).send(req);
      expect(response.statusCode).toBe(500);
    });
  });
});
