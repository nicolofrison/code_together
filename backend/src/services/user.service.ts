import { userRepository } from '../repositories/user.repository';
import AuthPost from '../models/http/requests/authPost';
import AuthenticationUtils from '../utils/authentication';
import WrongPasswordError from '../models/exceptions/WrongPasswordError';
import User from '../models/entities/User';
import RecordNotFound from '../models/exceptions/RecordNotFoundError';
import RecordAlreadyExistsError from '../models/exceptions/RecordAlreadyExistsError';

class UserService {
  private userRepo = userRepository;

  private formatUser(user: User): User {
    delete user.password;
    return user;
  }

  public async findById(id: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (user == null) {
      throw new RecordNotFound(User.name, 'id');
    }

    return this.formatUser(user);
  }

  public async createUser(authData: AuthPost): Promise<User> {
    const alreadyExistentUser = await this.userRepo.findByEmail(authData.email);
    if (alreadyExistentUser != null) {
      throw new RecordAlreadyExistsError(User.name, 'email');
    }

    const hashedPassword = await AuthenticationUtils.hash(authData.password);

    const user = await this.userRepo.createAndSave(
      authData.email,
      hashedPassword
    );
    return this.formatUser(user);
  }

  public async signIn(authData: AuthPost): Promise<User> {
    const user = await this.userRepo.findByEmail(authData.email);
    if (user === null) {
      throw new RecordNotFound(User.name, 'email');
    }

    if (
      (await AuthenticationUtils.passwordIsEqualToHashed(
        authData.password,
        user.password
      )) === false
    ) {
      throw new WrongPasswordError();
    }

    return this.formatUser(user);
  }
}

export default UserService;
export const userService = new UserService();
