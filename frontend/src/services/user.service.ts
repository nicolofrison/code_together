import axios from 'axios';

import AuthPost from '../models/http/requests/authPost';
import BaseService from './base.service';

export class UserService extends BaseService {
  private static instance: UserService;

  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  public signUp(authPost: AuthPost) {
    return axios.post(this.baseUrl + 'auth/signup', authPost);
  }

  public signIn(authPost: AuthPost) {
    return axios.post(this.baseUrl + 'auth/signin', authPost);
  }
}

export default UserService.getInstance();
