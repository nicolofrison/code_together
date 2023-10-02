import { userRepository } from '../repositories/user.repository';
import AuthPost from '../models/http/requests/authPost';
import AuthenticationUtils from '../utils/authentication';
import WrongPasswordError from '../models/exceptions/WrongPasswordError';
import User from '../models/entities/User';
import RecordNotFound from '../models/exceptions/RecordNotFoundError';

class UserService {
  private userRepo = userRepository;

  public async createUser(authData: AuthPost): Promise<User> {
    const alreadyExistentUser = await this.userRepo.findByEmail(authData.email);
    if (alreadyExistentUser != null) {
      throw new WrongPasswordError();
    }

    const hashedPassword = await AuthenticationUtils.hash(authData.password);

    const user = await this.userRepo.createAndSave(
      authData.email,
      hashedPassword
    );
    return user;
  }

  public async signIn(authData: AuthPost): Promise<User> {
    const user = await this.userRepo.findByEmail(authData.email);
    if (user === null) {
      throw new RecordNotFound(User.constructor.name, 'email');
    }

    if (
      (await AuthenticationUtils.passwordIsEqualToHashed(
        authData.password,
        user.password
      )) === false
    ) {
      throw new WrongPasswordError();
    }

    return user;
  }
}

export default UserService;
export const userService = new UserService();
