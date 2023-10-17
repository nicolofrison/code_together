import Code from '../models/entities/Code';
import RecordNotFound from '../models/exceptions/RecordNotFoundError';
import { codeRepository } from '../repositories/code.repository';

class CodeService {
  private codeRepo = codeRepository;

  public async findAll(ownerId: number): Promise<Code[]> {
    return await this.codeRepo.find({ where: { ownerId } });
  }

  public async findById(id: number): Promise<Code> {
    const code = await this.codeRepo.findOneBy({ id });
    if (code == null) {
      throw new RecordNotFound(Code.name, 'id');
    }

    return code;
  }
}

export default CodeService;
export const codeService = new CodeService();
