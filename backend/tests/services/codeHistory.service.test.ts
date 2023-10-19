import Code from '../../src/models/entities/Code';
import CodeHistory from '../../src/models/entities/CodeHistory';
import RecordNotFoundError from '../../src/models/exceptions/RecordNotFoundError';
import { codeHistoryRepository } from '../../src/repositories/codeHistory.repository';
import { codeRepository } from '../../src/repositories/code.repository';
import { codeHistoryService } from '../../src/services/codeHistory.service';
import { DeleteResult } from 'typeorm';
import RecordNotAuthorizedError from '../../src/models/exceptions/RecordNotAuthorizedError';
import NotLastCodeHistoryError from '../../src/models/exceptions/NotLastCodeHistoryError';
import CodeHistoryPost from '../../src/models/http/requests/codeHistoryPost';
import { gitService } from '../../src/services/git.service';
import GitNothingToCommitError from '../../src/models/exceptions/GitNothingToCommitError';

describe('CodeHistoryService', () => {
  jest.mock('../../src/repositories/code.repository', () => jest.fn());
  jest.mock('../../src/repositories/codeHistory.repository', () => jest.fn());
  jest.mock('../../src/services/git.service', () => jest.fn());

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

      gitService.commit = jest.fn(() =>
        Promise.resolve({
          timestamp: expectedCodeHistory.timestamp,
          hash: expectedCodeHistory.commit_sha,
          date: 'string',
          message: 'string',
          refs: 'string',
          body: 'string',
          author_name: 'string',
          author_email: 'string'
        })
      );

      const codeHistoryPost = {
        codeId: expectedCode.name,
        comment: expectedCodeHistory.comment,
        text: 'text'
      } as CodeHistoryPost;
      const codeHistory = await codeHistoryService.create(
        expectedCode.ownerId,
        codeHistoryPost
      );
      expect(codeHistory).toBe(expectedCodeHistory);
      expect(gitService.commit).toBeCalled();
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

      gitService.commit = jest.fn(() =>
        Promise.resolve({
          timestamp: expectedCodeHistory.timestamp,
          hash: expectedCodeHistory.commit_sha,
          date: 'string',
          message: 'string',
          refs: 'string',
          body: 'string',
          author_name: 'string',
          author_email: 'string'
        })
      );

      const codeHistoryPost = {
        codeId: expectedCode.id,
        comment: expectedCodeHistory.comment,
        text: 'text'
      } as CodeHistoryPost;
      const codeHistory = await codeHistoryService.create(
        expectedCode.ownerId,
        codeHistoryPost
      );
      expect(codeHistory).toBe(expectedCodeHistory);
      expect(gitService.commit).toBeCalled();
    });

    test('create codeHistory with already existent code and same content throws GitNothingToCommitError', async () => {
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
        Promise.reject(new Error("It shouldn't call me"))
      );

      gitService.commit = jest.fn(() =>
        Promise.reject(new GitNothingToCommitError())
      );

      const codeHistoryPost = {
        codeId: expectedCode.id,
        comment: expectedCodeHistory.comment,
        text: 'text'
      } as CodeHistoryPost;
      const codeHistoryCreate = codeHistoryService.create(
        expectedCode.ownerId,
        codeHistoryPost
      );
      await expect(codeHistoryCreate).rejects.toThrow(GitNothingToCommitError);
    });

    test('create codeHistory with not existent code through code id throws RecordNotFoundError', async () => {
      codeRepository.findOneBy = jest.fn(() => Promise.resolve(null));

      const codeHistoryPost = {
        codeId: 1,
        comment: 'comment',
        text: 'text'
      } as CodeHistoryPost;
      const codeHistoryCreate = codeHistoryService.create(1, codeHistoryPost);
      await expect(codeHistoryCreate).rejects.toThrow(RecordNotFoundError);
    });

    test('create codeHistory with already existent code owned by another user throws RecordNotAuthorizedError', async () => {
      const expectedCode = {
        id: 1,
        name: 'name',
        ownerId: 1,
        owner: {}
      } as Code;

      codeRepository.findOneBy = jest.fn(() => Promise.resolve(expectedCode));

      const codeHistoryPost = {
        codeId: expectedCode.id,
        comment: 'comment',
        text: 'text'
      } as CodeHistoryPost;
      const codeHistoryCreate = codeHistoryService.create(2, codeHistoryPost);
      await expect(codeHistoryCreate).rejects.toThrow(RecordNotAuthorizedError);
    });
  });

  describe('delete', () => {
    test('delete last code history not last standing with commit reset successfully', async () => {
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

      codeHistoryRepository.findLastTwoByLastCodeHistoryId = jest.fn(() =>
        Promise.resolve([
          expectedCodeHistory,
          { ...expectedCodeHistory, id: 2 }
        ])
      );
      codeHistoryRepository.findOne = jest.fn(() =>
        Promise.resolve(expectedCodeHistory)
      );
      codeHistoryRepository.delete = jest.fn(() =>
        Promise.resolve({} as DeleteResult)
      );
      gitService.resetToCommit = jest.fn(() => Promise.resolve());
      gitService.delete = jest.fn(() =>
        Promise.reject(new Error("It shouldn't be called"))
      );

      await codeHistoryService.delete(
        expectedCode.ownerId,
        expectedCodeHistory.id
      );
      expect(codeHistoryRepository.delete).toBeCalled();
      expect(gitService.resetToCommit).toBeCalled();
      expect(gitService.delete).not.toBeCalled();
    });

    test('delete last standing code history with code delete successfully', async () => {
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

      codeHistoryRepository.findLastTwoByLastCodeHistoryId = jest.fn(() =>
        Promise.resolve([expectedCodeHistory])
      );
      codeHistoryRepository.findOne = jest.fn(() =>
        Promise.resolve(expectedCodeHistory)
      );
      codeHistoryRepository.delete = jest.fn(() =>
        Promise.resolve({} as DeleteResult)
      );
      codeRepository.delete = jest.fn(() =>
        Promise.resolve({
          raw: ''
        })
      );
      gitService.resetToCommit = jest.fn(() =>
        Promise.reject(new Error("It shouldn't be called"))
      );
      gitService.delete = jest.fn(() => Promise.resolve());

      await codeHistoryService.delete(
        expectedCode.ownerId,
        expectedCodeHistory.id
      );
      expect(codeHistoryRepository.delete).toBeCalled();
      expect(gitService.resetToCommit).not.toBeCalled();
      expect(gitService.delete).toBeCalled();
    });

    test('delete code history not found throws RecordNotFoundError', async () => {
      codeHistoryRepository.findLastTwoByLastCodeHistoryId = jest.fn(() =>
        Promise.resolve([])
      );
      codeHistoryRepository.findOne = jest.fn(() => Promise.resolve(null));
      gitService.resetToCommit = jest.fn(() =>
        Promise.reject(new Error("It shouldn't be called"))
      );
      gitService.delete = jest.fn(() =>
        Promise.reject(new Error("It shouldn't be called"))
      );

      const codeHistoryDelete = codeHistoryService.delete(1, 1);
      await expect(codeHistoryDelete).rejects.toThrow(RecordNotFoundError);
      expect(gitService.resetToCommit).not.toBeCalled();
      expect(gitService.delete).not.toBeCalled();
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

      codeHistoryRepository.findLastTwoByLastCodeHistoryId = jest.fn(() =>
        Promise.resolve([expectedLastCodeHistory, expectedCodeHistory])
      );
      codeHistoryRepository.findOne = jest.fn(() =>
        Promise.resolve(expectedCodeHistory)
      );
      gitService.resetToCommit = jest.fn(() =>
        Promise.reject(new Error("It shouldn't be called"))
      );
      gitService.delete = jest.fn(() =>
        Promise.reject(new Error("It shouldn't be called"))
      );

      const codeHistoryDelete = codeHistoryService.delete(
        expectedCode.ownerId,
        expectedCodeHistory.id
      );
      await expect(codeHistoryDelete).rejects.toThrow(NotLastCodeHistoryError);
      expect(gitService.resetToCommit).not.toBeCalled();
      expect(gitService.delete).not.toBeCalled();
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

      codeHistoryRepository.findLastTwoByLastCodeHistoryId = jest.fn(() =>
        Promise.resolve([expectedCodeHistory, expectedCodeHistory])
      );
      codeHistoryRepository.findOne = jest.fn(() =>
        Promise.resolve(expectedCodeHistory)
      );
      gitService.resetToCommit = jest.fn(() =>
        Promise.reject(new Error("It shouldn't be called"))
      );
      gitService.delete = jest.fn(() =>
        Promise.reject(new Error("It shouldn't be called"))
      );

      const codeHistoryDelete = codeHistoryService.delete(
        2,
        expectedCodeHistory.id
      );
      await expect(codeHistoryDelete).rejects.toThrow(RecordNotAuthorizedError);
      expect(gitService.resetToCommit).not.toBeCalled();
      expect(gitService.delete).not.toBeCalled();
    });
  });
});
