import { Repository } from 'typeorm/repository/Repository';
import { User } from '../entities/User';
import { userRepository } from '../repositories/user.repository';

class UserService {
  userRepository: Repository<User>;

  __constructor() {
    this.userRepository = userRepository;
  }
}

export const userService = new UserService();
