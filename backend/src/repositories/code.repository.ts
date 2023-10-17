import { appDataSource } from '../config/dataSource';
import Code from '../models/entities/Code';

export const codeRepository = appDataSource.getRepository(Code).extend({
  async createAndSave(name: string, ownerId: number) {
    const code = new Code(name, ownerId);
    return this.save(code);
  }
});
