import { appDataSource } from '../config/dataSource';
import CodeHistory from '../models/entities/CodeHistory';

export const codeHistoryRepository = appDataSource
  .getRepository(CodeHistory)
  .extend({
    async createAndSave(
      codeId: number,
      comment: string,
      commit_sha: string,
      timestamp: Date
    ) {
      const codeHistory = new CodeHistory(
        codeId,
        comment,
        commit_sha,
        timestamp
      );
      return this.save(codeHistory);
    }
  });
