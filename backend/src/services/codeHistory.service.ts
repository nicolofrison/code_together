import Code from '../models/entities/Code';
import CodeHistory from '../models/entities/CodeHistory';
import NotLastCodeHistoryError from '../models/exceptions/NotLastCodeHistoryError';
import RecordNotAuthorized from '../models/exceptions/RecordNotAuthorizedError';
import RecordNotFound from '../models/exceptions/RecordNotFoundError';
import CodeHistoryPost from '../models/http/requests/codeHistoryPost';
import { codeRepository } from '../repositories/code.repository';
import { codeHistoryRepository } from '../repositories/codeHistory.repository';
import { gitService } from './git.service';

class CodeHistoryService {
  private codeRepo = codeRepository;
  private codeHistoryRepo = codeHistoryRepository;

  public async findAll(codeId: number): Promise<CodeHistory[]> {
    const codeHistories = await this.codeHistoryRepo.find({
      where: { codeId },
      order: { timestamp: 'DESC' }
    });

    return codeHistories;
  }

  public async findLastByUser(ownerId: number) {
    const codeHistory = await this.codeHistoryRepo.findOne({
      where: { code: { ownerId } },
      order: { timestamp: 'DESC' }
    });
    if (codeHistory == null) {
      throw new RecordNotFound(CodeHistory.name, 'ownerId');
    }

    return codeHistory;
  }

  public async findById(id: number): Promise<CodeHistory> {
    const codeHistory = await this.codeHistoryRepo.findOneBy({ id });
    if (codeHistory == null) {
      throw new RecordNotFound(CodeHistory.name, 'id');
    }

    return codeHistory;
  }

  public async create(
    ownerId: number,
    codeHistoryPost: CodeHistoryPost
  ): Promise<CodeHistory> {
    let code = null;

    if (typeof codeHistoryPost.codeId === 'number') {
      // Create only codeHistory
      code = await this.codeRepo.findOneBy({
        id: codeHistoryPost.codeId
      });
      if (code === null) {
        throw new RecordNotFound(Code.name, 'id');
      } else if (code.ownerId !== ownerId) {
        throw new RecordNotAuthorized(Code.name, 'id');
      }
    } else {
      // Create code with codeId as name
      code = await this.codeRepo.createAndSave(codeHistoryPost.codeId, ownerId);
    }

    const commitInfo = await gitService.commit(
      ownerId.toString(),
      ownerId.toString(),
      codeHistoryPost.text,
      codeHistoryPost.comment
    );

    return await this.codeHistoryRepo.createAndSave(
      code.id,
      codeHistoryPost.comment,
      commitInfo.hash,
      commitInfo.timestamp
    );
  }

  public async delete(ownerId: number, codeHistoryId: number) {
    const [lastCodeHistory, beforeLastCodeHistory] =
      await this.codeHistoryRepo.findLastTwoByLastCodeHistoryId(codeHistoryId);

    const codeHistory = await this.codeHistoryRepo.findOne({
      where: {
        id: codeHistoryId
      },
      relations: {
        code: true
      }
    });
    if (codeHistory === null) {
      throw new RecordNotFound(CodeHistory.name, 'id');
    } else if (codeHistory.code.ownerId !== ownerId) {
      throw new RecordNotAuthorized(Code.name, 'id');
    } else if (lastCodeHistory.id !== codeHistory.id) {
      // error not last commit
      throw new NotLastCodeHistoryError();
    }

    await this.codeHistoryRepo.delete(codeHistoryId);
    if (beforeLastCodeHistory === null || beforeLastCodeHistory === undefined) {
      await this.codeRepo.delete(codeHistory.codeId);
      await gitService.delete(ownerId.toString());
    } else {
      await gitService.resetToCommit(
        ownerId.toString(),
        beforeLastCodeHistory.commit_sha
      );
    }
  }
}

export default CodeHistoryService;
export const codeHistoryService = new CodeHistoryService();
