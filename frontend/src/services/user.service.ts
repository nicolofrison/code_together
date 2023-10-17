import AuthPost from '../models/http/requests/authPost';
import BaseAuthService from './baseAuth.service';
import UserUtils from '../utils/UserUtils';
import User from '../models/interfaces/user.interface';
import { use } from 'chai';

export class UserService extends BaseAuthService {
  private static instance: UserService;

  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  public async signUp(authPost: AuthPost) {
    const response = await this.apiRequest().post('auth/signup', authPost);

    return response.data as User;
  }

  public async signIn(authPost: AuthPost) {
    const response = await this.apiRequest().post('auth/signin', authPost);
    const user = response.data;

    if (!user.accessToken || !user.wsCode) {
      throw new Error(
        'The response from the server is missing some information'
      );
    }

    UserUtils.getInstance().setUser(user);
    delete user.accessToken;

    return user as User;
  }

  signOut() {
    UserUtils.getInstance().removeUser();
  }
}

export default UserService.getInstance();
