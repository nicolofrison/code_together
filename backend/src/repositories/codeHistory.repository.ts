import { Repository } from 'typeorm';
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
    },
    async findLastTwoByLastCodeHistoryId(codeHistoryId: number) {
      return await (this as Repository<CodeHistory>)
        .createQueryBuilder('codeHistory')
        .where((qb) => {
          const subQuery = qb
            .subQuery()
            .select('ch.codeId')
            .from(CodeHistory, 'ch')
            .where('ch.id = :codeHistoryId')
            .getQuery();
          return 'codeHistory.codeId IN ' + subQuery;
        })
        .setParameter('codeHistoryId', codeHistoryId)
        .orderBy('timestamp', 'DESC')
        .take(2)
        .getMany();
    }
  });
