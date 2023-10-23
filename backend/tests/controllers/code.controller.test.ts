import 'dotenv/config';
import { codeService } from '../../src/services/code.service';
import request = require('supertest');
import Server from '../../src/server';
import Code from '../../src/models/entities/Code';
import RecordNotFoundError from '../../src/models/exceptions/RecordNotFoundError';
import { codeControllerInstance } from '../../src/controllers/code.controller';
import { jwtService } from '../../src/services/jwt.service';
import User from '../../src/models/entities/User';
import { gitService } from '../../src/services/git.service';

describe('CodeController', () => {
  jest.mock('../../src/services/code.service', () => jest.fn());
  jest.mock('../../src/services/jwt.service', () => jest.fn());
  jest.mock('../../src/services/git.service', () => jest.fn());

  const server = new Server([codeControllerInstance]);

  const expectedUser = { email: 'email', password: 'psw', id: 1 };
  jwtService.authenticate = jest.fn(() => {
    return Promise.resolve(expectedUser as User);
  });
  const accessToken = jwtService.createToken(expectedUser);

  describe('findAll', () => {
    const apiUrl = '/codes';

    test('find all codes successfully', async () => {
      const expectedCodes = [
        {
          name: 'code name',
          id: 1,
          ownerId: 4
        }
      ];
      codeService.findAll = jest.fn(() =>
        Promise.resolve(expectedCodes as Code[])
      );

      const response = await request(server.app)
        .get(apiUrl)
        .send()
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(expectedCodes);
    });

    test('find all codes empty', async () => {
      const expectedCodes = [];
      codeService.findAll = jest.fn(() =>
        Promise.resolve(expectedCodes as Code[])
      );

      const response = await request(server.app)
        .get(apiUrl)
        .send()
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(expectedCodes);
    });
  });

  describe('findById', () => {
    const apiUrl = '/codes/1';

    test('find code by id successfully', async () => {
      const expectedCode = {
        name: 'code name',
        id: 1,
        ownerId: 4
      };
      const expectedCodeWithText = { ...expectedCode, text: 'text' };
      codeService.findById = jest.fn(() =>
        Promise.resolve(expectedCode as Code)
      );
      gitService.getCode = jest.fn(() =>
        Promise.resolve(expectedCodeWithText.text)
      );

      const response = await request(server.app)
        .get(apiUrl)
        .send()
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(expectedCodeWithText);
    });

    test('find code by id without text response 500', async () => {
      const expectedCode = {
        name: 'code name',
        id: 1,
        ownerId: 4
      };
      codeService.findById = jest.fn(() =>
        Promise.resolve(expectedCode as Code)
      );
      gitService.getCode = jest.fn(() => Promise.reject(new Error()));

      const response = await request(server.app)
        .get(apiUrl)
        .send()
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(500);
    });

    test('find code by id not found response 404', async () => {
      codeService.findById = jest.fn(() =>
        Promise.reject(new RecordNotFoundError(Code.name, 'id'))
      );

      const response = await request(server.app)
        .get(apiUrl)
        .send()
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(404);
    });
  });
});
