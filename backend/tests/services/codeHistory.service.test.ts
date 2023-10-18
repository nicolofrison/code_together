import Code from '../../src/models/entities/Code';
import CodeHistory from '../../src/models/entities/CodeHistory';
import RecordNotFoundError from '../../src/models/exceptions/RecordNotFoundError';
import { codeHistoryRepository } from '../../src/repositories/codeHistory.repository';
import { codeRepository } from '../../src/repositories/code.repository';
import { codeHistoryService } from '../../src/services/codeHistory.service';
import { DeleteResult } from 'typeorm';
import RecordNotAuthorizedError from '../../src/models/exceptions/RecordNotAuthorizedError';
import NotLastCodeHistoryError from '../../src/models/exceptions/NotLastCodeHistoryError';

describe('CodeHistoryService', () => {
  jest.mock('../../src/repositories/code.repository', () => jest.fn());
  jest.mock('../../src/repositories/codeHistory.repository', () => jest.fn());

  describe('findAll', () => {
    test('find all successfully', async () => {
      const expectedCodeHistories = [
        {
          id: 1,
          codeId: 1,
          code: {},
          comment: 'comment',
          commit_sha: 'commit_sha',
          timestamp: new Date()
        }
      ] as CodeHistory[];
      codeHistoryRepository.find = jest.fn(() =>
        Promise.resolve(expectedCodeHistories)
      );

      const codeHistory = await codeHistoryService.findAll(1);
      expect(codeHistory).toBe(expectedCodeHistories);
    });

    test('find all empty array', async () => {
      const expectedCodeHistories = [];
      codeHistoryRepository.find = jest.fn(() =>
        Promise.resolve(expectedCodeHistories as CodeHistory[])
      );

      const codeHistory = await codeHistoryService.findAll(1);
      expect(codeHistory).toBe(expectedCodeHistories);
    });
  });

  describe('findById', () => {
    test('findById codeHistory found', async () => {
      const expectedCodeHistory = {
        id: 1,
        codeId: 1,
        code: {},
        comment: 'comment',
        commit_sha: 'commit_sha',
        timestamp: new Date()
      } as CodeHistory;
      codeHistoryRepository.findOneBy = jest.fn(() =>
        Promise.resolve(expectedCodeHistory)
      );

      const codeHistory = await codeHistoryService.findById(1);
      expect(codeHistory).toBe(expectedCodeHistory);
    });

    test('findById codeHistory not found throws RecordNotFoundError', async () => {
      codeHistoryRepository.findOneBy = jest.fn(() => Promise.resolve(null));

      await expect(codeHistoryService.findById(1)).rejects.toThrow(
        RecordNotFoundError
      );
    });
  });

  describe('create', () => {
    test('create first codeHistory successfully that creates the code too', async () => {
      const expectedCode = {
        id: 1,
        name: 'name',
        ownerId: 1,
        owner: {}
      } as Code;
      const expectedCodeHistory = {
        id: 1,
        codeId: 1,
        code: expectedCode,
        comment: 'comment',
        commit_sha: 'commit_sha',
        timestamp: new Date()
      } as CodeHistory;

      codeRepository.findOneBy = jest.fn(() => Promise.resolve(null));
      codeRepository.createAndSave = jest.fn(() =>
        Promise.resolve(expectedCode)
      );
      codeHistoryRepository.createAndSave = jest.fn(() =>
        Promise.resolve(expectedCodeHistory)
      );

      const codeHistory = await codeHistoryService.create(
        expectedCode.ownerId,
        expectedCode.name,
        expectedCode.id,
        expectedCodeHistory.comment,
        'text'
      );
      expect(codeHistory).toBe(expectedCodeHistory);
    });

    test('create codeHistory successfully with already existent code', async () => {
      const expectedCode = {
        id: 1,
        name: 'name',
        ownerId: 1,
        owner: {}
      } as Code;
      const expectedCodeHistory = {
        id: 1,
        codeId: 1,
        code: expectedCode,
        comment: 'comment',
        commit_sha: 'commit_sha',
        timestamp: new Date()
      } as CodeHistory;

      codeRepository.findOneBy = jest.fn(() => Promise.resolve(expectedCode));
      codeRepository.createAndSave = jest.fn(() =>
        Promise.reject(new Error("It shouldn't call me"))
      );
      codeHistoryRepository.createAndSave = jest.fn(() =>
        Promise.resolve(expectedCodeHistory)
      );

      const codeHistory = await codeHistoryService.create(
        expectedCode.ownerId,
        expectedCode.name,
        expectedCode.id,
        expectedCodeHistory.comment,
        'text'
      );
      expect(codeHistory).toBe(expectedCodeHistory);
    });

    test('create codeHistory with already existent code owned by another user throws RecordNotAuthorizedError', async () => {
      const expectedCode = {
        id: 1,
        name: 'name',
        ownerId: 1,
        owner: {}
      } as Code;

      codeRepository.findOneBy = jest.fn(() => Promise.resolve(expectedCode));

      const codeHistoryCreate = codeHistoryService.create(
        2,
        expectedCode.name,
        expectedCode.id,
        'comment',
        'text'
      );
      await expect(codeHistoryCreate).rejects.toThrow(RecordNotAuthorizedError);
    });
  });

  describe('delete', () => {
    test('delete code history successfully', async () => {
      const expectedCode = {
        id: 1,
        name: 'name',
        ownerId: 1,
        owner: {}
      } as Code;
      const expectedCodeHistory = {
        id: 1,
        codeId: 1,
        code: expectedCode,
        comment: 'comment',
        commit_sha: 'commit_sha',
        timestamp: new Date()
      } as CodeHistory;

      codeHistoryRepository.findOne = jest.fn(() =>
        Promise.resolve(expectedCodeHistory)
      );
      codeHistoryRepository.findOneBy = jest.fn(() =>
        Promise.resolve(expectedCodeHistory)
      );
      codeHistoryRepository.delete = jest.fn(() =>
        Promise.resolve({} as DeleteResult)
      );

      await codeHistoryService.delete(
        expectedCode.ownerId,
        expectedCodeHistory.id
      );
      expect(codeHistoryRepository.delete).toBeCalled();
    });

    test('delete code history not found throws RecordNotFoundError', async () => {
      codeHistoryRepository.findOne = jest.fn(() => Promise.resolve(null));
      codeHistoryRepository.findOneBy = jest.fn(() => Promise.resolve(null));

      const codeHistoryDelete = codeHistoryService.delete(1, 1);
      await expect(codeHistoryDelete).rejects.toThrow(RecordNotFoundError);
    });

    test('delete codeHistory that is not last throws error', async () => {
      const expectedCode = {
        id: 1,
        name: 'name',
        ownerId: 1,
        owner: {}
      } as Code;
      const expectedCodeHistory = {
        id: 1,
        codeId: 1,
        code: expectedCode,
        comment: 'comment',
        commit_sha: 'commit_sha',
        timestamp: new Date()
      } as CodeHistory;
      const expectedLastCodeHistory = {
        ...expectedCodeHistory,
        id: 2
      } as CodeHistory;

      codeHistoryRepository.findOne = jest.fn(() =>
        Promise.resolve(expectedLastCodeHistory)
      );
      codeHistoryRepository.findOneBy = jest.fn(() =>
        Promise.resolve(expectedCodeHistory)
      );

      const codeHistoryDelete = codeHistoryService.delete(
        expectedCode.ownerId,
        expectedCodeHistory.id
      );
      await expect(codeHistoryDelete).rejects.toThrow(NotLastCodeHistoryError);
    });

    test('delete codeHistory with code owned by another user throws RecordNotAuthorizedError', async () => {
      const expectedCode = {
        id: 1,
        name: 'name',
        ownerId: 1,
        owner: {}
      } as Code;
      const expectedCodeHistory = {
        id: 1,
        codeId: 1,
        code: expectedCode,
        comment: 'comment',
        commit_sha: 'commit_sha',
        timestamp: new Date()
      } as CodeHistory;

      codeHistoryRepository.findOne = jest.fn(() =>
        Promise.resolve(expectedCodeHistory)
      );
      codeHistoryRepository.findOneBy = jest.fn(() =>
        Promise.resolve(expectedCodeHistory)
      );

      const codeHistoryDelete = codeHistoryService.delete(
        2,
        expectedCodeHistory.id
      );
      await expect(codeHistoryDelete).rejects.toThrow(RecordNotAuthorizedError);
    });
  });
});
