import 'dotenv/config';
import { codeHistoryService } from '../../src/services/codeHistory.service';
import request = require('supertest');
import Server from '../../src/server';
import Code from '../../src/models/entities/Code';
import RecordNotFoundError from '../../src/models/exceptions/RecordNotFoundError';
import { jwtService } from '../../src/services/jwt.service';
import User from '../../src/models/entities/User';
import { codeHistoryControllerInstance } from '../../src/controllers/codeHistory.controller';
import CodeHistory from '../../src/models/entities/CodeHistory';
import CodeHistoryPost from '../../src/models/http/requests/codeHistoryPost';
import RecordNotAuthorizedError from '../../src/models/exceptions/RecordNotAuthorizedError';
import NotLastCodeHistoryError from '../../src/models/exceptions/NotLastCodeHistoryError';
import GitNothingToCommitError from '../../src/models/exceptions/GitNothingToCommitError';

describe('CodeController', () => {
  jest.mock('../../src/services/codeHistory.service', () => jest.fn());
  jest.mock('../../src/services/jwt.service', () => jest.fn());

  const server = new Server([codeHistoryControllerInstance]);

  const expectedUser = { email: 'email', password: 'psw', id: 1 };
  jwtService.authenticate = jest.fn(() => {
    return Promise.resolve(expectedUser as User);
  });
  const accessToken = jwtService.createToken(expectedUser);

  describe('findAll', () => {
    const apiUrl = '/codeHistories';

    test('find all codeHistories successfully', async () => {
      const expectedCodeHistories = [
        {
          code: {},
          comment: 'comment',
          commit_sha: 'commit',
          timestamp: new Date()
        }
      ] as CodeHistory[];
      codeHistoryService.findAll = jest.fn(() =>
        Promise.resolve(expectedCodeHistories)
      );

      const response = await request(server.app)
        .get(apiUrl + '?codeId=1')
        .send()
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject([
        {
          ...expectedCodeHistories[0],
          timestamp: expectedCodeHistories[0].timestamp.toISOString()
        }
      ]);
    });

    test('find all codes empty', async () => {
      const expectedCodeHistories = [] as CodeHistory[];
      codeHistoryService.findAll = jest.fn(() =>
        Promise.resolve(expectedCodeHistories)
      );

      const response = await request(server.app)
        .get(apiUrl + '?codeId=1')
        .send()
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(expectedCodeHistories);
    });

    test('find all codes without codeId response 400', async () => {
      const expectedCodeHistories = [] as CodeHistory[];
      codeHistoryService.findAll = jest.fn(() =>
        Promise.resolve(expectedCodeHistories)
      );

      const response = await request(server.app)
        .get(apiUrl)
        .send()
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(400);
    });
  });

  describe('findById', () => {
    const apiUrl = '/codeHistories/1';

    test('find code by id successfully', async () => {
      const expectedCodeHistory = {
        code: {},
        comment: 'comment',
        commit_sha: 'commit',
        timestamp: new Date()
      } as CodeHistory;
      codeHistoryService.findById = jest.fn(() =>
        Promise.resolve(expectedCodeHistory)
      );

      const response = await request(server.app)
        .get(apiUrl)
        .send()
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        ...expectedCodeHistory,
        timestamp: expectedCodeHistory.timestamp.toISOString()
      });
    });

    test('find code by id not found response 404', async () => {
      codeHistoryService.findById = jest.fn(() =>
        Promise.reject(new RecordNotFoundError(Code.name, 'id'))
      );

      const response = await request(server.app)
        .get(apiUrl)
        .send()
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(404);
    });
  });

  describe('create', () => {
    const apiUrl = '/codeHistories';

    test('create codeHistory of non existent code successfully', async () => {
      const expectedCode = {
        id: 1,
        ownerId: 1,
        name: 'name'
      } as Code;
      const expectedCodeHistory = {
        id: 1,
        code: expectedCode,
        comment: 'comment',
        commit_sha: 'commit',
        timestamp: new Date()
      } as CodeHistory;
      codeHistoryService.create = jest.fn(() =>
        Promise.resolve(expectedCodeHistory)
      );

      const codeHistoryPost = {
        codeId: expectedCode.id,
        comment: expectedCodeHistory.comment,
        text: 'text'
      } as CodeHistoryPost;
      const response = await request(server.app)
        .post(apiUrl)
        .send(codeHistoryPost)
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        ...expectedCodeHistory,
        timestamp: expectedCodeHistory.timestamp.toISOString()
      });
    });

    test('create codeHistory with existent code id and no changes response 400', async () => {
      codeHistoryService.create = jest.fn(() =>
        Promise.reject(new GitNothingToCommitError())
      );

      const codeHistoryPost = {
        codeId: 1,
        comment: 'commit with no changes',
        text: 'text'
      } as CodeHistoryPost;
      const response = await request(server.app)
        .post(apiUrl)
        .send(codeHistoryPost)
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(400);
    });

    test('create codeHistory with non existent codeId response 400', async () => {
      codeHistoryService.create = jest.fn(() =>
        Promise.reject(new RecordNotFoundError(Code.name, 'id'))
      );

      const codeHistoryPost = {
        codeId: 1,
        comment: 'comment',
        text: 'text'
      } as CodeHistoryPost;
      const response = await request(server.app)
        .post(apiUrl)
        .send(codeHistoryPost)
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(400);
    });

    test('create codeHistory with existent codeId owned by another user response 403', async () => {
      codeHistoryService.create = jest.fn(() =>
        Promise.reject(new RecordNotAuthorizedError(Code.name, 'id'))
      );

      const codeHistoryPost = {
        codeId: 1,
        comment: 'comment',
        text: 'text'
      } as CodeHistoryPost;
      const response = await request(server.app)
        .post(apiUrl)
        .send(codeHistoryPost)
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(403);
    });
  });

  describe('delete', () => {
    const apiUrl = '/codeHistories/1';

    test('delete last codeHistory successfully', async () => {
      codeHistoryService.delete = jest.fn(() => Promise.resolve());

      const response = await request(server.app)
        .delete(apiUrl)
        .send()
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(200);
    });

    test('delete codeHistory not found response 404', async () => {
      codeHistoryService.delete = jest.fn(() =>
        Promise.reject(new RecordNotFoundError(CodeHistory.name, 'id'))
      );

      const response = await request(server.app)
        .delete(apiUrl)
        .send()
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(404);
    });

    test('delete codeHistory owner by another user response 403', async () => {
      codeHistoryService.delete = jest.fn(() =>
        Promise.reject(new RecordNotAuthorizedError(CodeHistory.name, 'id'))
      );

      const response = await request(server.app)
        .delete(apiUrl)
        .send()
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(403);
    });

    test('delete codeHistory that is not the last one response 400', async () => {
      codeHistoryService.delete = jest.fn(() =>
        Promise.reject(new NotLastCodeHistoryError())
      );

      const response = await request(server.app)
        .delete(apiUrl)
        .send()
        .set({ authorization: 'Bearer ' + accessToken });
      expect(response.statusCode).toBe(400);
    });
  });
});
