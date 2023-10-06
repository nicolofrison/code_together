import axios, { CreateAxiosDefaults } from 'axios';
import UserUtils from '../utils/UserUtils';

export default abstract class BaseAuthService {
  protected readonly baseUrl = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/`;

  private getToken() {
    return UserUtils.getToken();
  }

  protected axiosWithOptions() {
    const defaultOptions: CreateAxiosDefaults<object> = {
      baseURL: this.baseUrl
    };

    const token = this.getToken();
    if (token) {
      defaultOptions.headers = {
        Authorization: this.getToken(),
        'Content-Type': 'application/json; charset=utf-8'
      };
    }

    return axios.create(defaultOptions);
  }
}
