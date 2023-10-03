import axios from 'axios';

import AuthPost from '../models/http/requests/authPost';
import BaseService from './base.service';
import UserUtils from '../utils/UserUtils';
import User from '../models/interfaces/user.interface';

export class UserService extends BaseService {
  private static instance: UserService;

  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  public async signUp(authPost: AuthPost) {
    const response = await axios.post(this.baseUrl + 'auth/signup', authPost);

    return response.data as User;
  }

  public async signIn(authPost: AuthPost) {
    const response = await axios.post(this.baseUrl + 'auth/signin', authPost);
    const user = response.data;

    UserUtils.setUser(user);
    delete user.accessToken;

    return user as User;
  }
}

export default UserService.getInstance();
