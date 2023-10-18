import Code from '../models/entities/Code';
import CodeHistory from '../models/entities/CodeHistory';
import NotLastCodeHistoryError from '../models/exceptions/NotLastCodeHistoryError';
import RecordNotAuthorized from '../models/exceptions/RecordNotAuthorizedError';
import RecordNotFound from '../models/exceptions/RecordNotFoundError';
import CodeHistoryPost from '../models/http/requests/codeHistoryPost';
import { codeRepository } from '../repositories/code.repository';
import { codeHistoryRepository } from '../repositories/codeHistory.repository';

class CodeHistoryService {
  private codeRepo = codeRepository;
  private codeHistoryRepo = codeHistoryRepository;

  public async findAll(codeId: number): Promise<CodeHistory[]> {
    const codeHistories = await this.codeHistoryRepo.find({
      where: { codeId }
    });

    return codeHistories;
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

    // manage new text

    return await this.codeHistoryRepo.createAndSave(
      code.id,
      codeHistoryPost.comment,
      'commit_sha',
      new Date()
    );
  }

  public async delete(ownerId: number, codeHistoryId: number) {
    const lastCodeHistory = await this.codeHistoryRepo.findOne({
      order: { timestamp: 'DESC' }
    });
    const codeHistory = await this.codeHistoryRepo.findOneBy({
      id: codeHistoryId
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
  }
}

export default CodeHistoryService;
export const codeHistoryService = new CodeHistoryService();
