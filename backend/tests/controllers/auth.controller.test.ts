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
import { codeHistoryService } from '../../src/services/codeHistory.service';
import { gitService } from '../../src/services/git.service';
import CodeHistory from '../../src/models/entities/CodeHistory';
import Code from '../../src/models/entities/Code';

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
      codeHistoryService.findLastByUser = jest.fn(() =>
        Promise.reject(new RecordNotFoundError(CodeHistory.name, 'ownerId'))
      );
      gitService.getCode = jest.fn(() =>
        Promise.reject(new Error("It shouldn't come here"))
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
      expect(gitService.getCode).not.toBeCalled();
    });

    test('sign in a user successfully with last code history', async () => {
      const req = { email: 'email', password: 'password' };
      const expectedUser = {
        email: req.email,
        id: 1
      } as User;
      const expectedCode: Code = {
        id: 1,
        name: expectedUser.id.toString(),
        owner: expectedUser,
        ownerId: expectedUser.id
      };
      const expectedCodeHistory: CodeHistory = {
        id: 1,
        code: expectedCode,
        codeId: expectedCode.id,
        comment: 'comment',
        commit_sha: 'commit_sha',
        timestamp: new Date()
      };
      const expectedLastCodeHistoryWithText = {
        ...expectedCodeHistory,
        text: 'text'
      };

      userService.signIn = userService.findById = jest.fn(() =>
        Promise.resolve(expectedUser as User)
      );
      codeHistoryService.findLastByUser = jest.fn(() =>
        Promise.resolve(expectedCodeHistory)
      );
      gitService.getCode = jest.fn(() =>
        Promise.resolve(expectedLastCodeHistoryWithText.text)
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
      expect(response.body).toHaveProperty('lastCodeHistory', {
        ...expectedLastCodeHistoryWithText,
        timestamp: expectedCodeHistory.timestamp.toISOString()
      });
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
