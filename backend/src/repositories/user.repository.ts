import { appDataSource } from '../config/dataSource';
import User from '../models/entities/User';

export const userRepository = appDataSource.getRepository(User).extend({
  async createAndSave(email: string, password: string) {
    const user = new User(email, password);
    return this.save(user);
  },
  async findByEmail(email: string) {
    return await this.findOneBy({ email });
  }
});
