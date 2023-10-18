import Code from '../models/entities/Code';
import CodeHistory from '../models/entities/CodeHistory';
import RecordNotAuthorized from '../models/exceptions/RecordNotAuthorizedError';
import RecordNotFound from '../models/exceptions/RecordNotFoundError';
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
    name: string,
    codeId: number,
    comment: string,
    _: string // text
  ): Promise<CodeHistory> {
    let code = await this.codeRepo.findOneBy({ id: codeId });
    if (code !== null && code.ownerId !== ownerId) {
      throw new RecordNotAuthorized(Code.name, 'id');
    } else if (code === null) {
      code = await this.codeRepo.createAndSave(name, ownerId);
    }

    // manage new text

    return await this.codeHistoryRepo.createAndSave(
      codeId,
      comment,
      'commit_sha',
      new Date()
    );
  }

  public async delete(ownerId: number, codeHistoryId: number) {
    const codeHistory = await this.codeHistoryRepo.findOneBy({
      id: codeHistoryId
    });
    if (codeHistory === null) {
      throw new RecordNotFound(CodeHistory.name, 'id');
    } else if (codeHistory.code.ownerId !== ownerId) {
      throw new RecordNotAuthorized(Code.name, 'id');
    }

    await this.codeHistoryRepo.delete(codeHistoryId);
  }
}

export default CodeHistoryService;
export const codeHistoryService = new CodeHistoryService();
