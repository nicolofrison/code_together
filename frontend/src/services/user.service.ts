import AuthPost from '../models/http/requests/authPost';
import BaseAuthService from './baseAuth.service';
import UserUtils from '../utils/UserUtils';
import UserSession from '../models/interfaces/userSession.interface';
import User from '../models/interfaces/user.interface';
import UserSignInResponse from '../models/http/responses/userSignIn.interface';

export default class UserService extends BaseAuthService {
  private static instance: UserService;

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  public async signUp(authPost: AuthPost): Promise<User> {
    const response = await this.apiRequest().post('auth/signup', authPost);

    return response.data;
  }

  public async signIn(authPost: AuthPost): Promise<User> {
    const response = await this.apiRequest().post('auth/signin', authPost);
    const userResponse = response.data as UserSignInResponse;

    if (!userResponse.accessToken || !userResponse.wsCode) {
      throw new Error(
        'The response from the server is missing some information'
      );
    }

    UserUtils.getInstance().setUser(userResponse as UserSession);

    const user = { id: userResponse.id, email: userResponse.email } as User;

    return user;
  }

  signOut() {
    UserUtils.getInstance().removeUser();
  }
}
