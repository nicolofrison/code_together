import User from '../models/interfaces/user.interface';

export default class UserUtils {
  private static readonly userKey = 'user';

  public getUser(): User | null {
    const jsonUser = sessionStorage.getItem(UserUtils.userKey);
    console.log(jsonUser);
    if (!jsonUser) {
      return null;
    }

    const user = JSON.parse(jsonUser);
    console.debug(user);
    if (!user.accessToken) {
      this.removeUser();
      return null;
    }

    return user;
  }
  private static instance: UserUtils;
  public static getInstance() {
    if (!this.instance) {
      this.instance = new UserUtils();
    }

    return this.instance;
  }

  public getToken(): string | null {
    const user = this.getUser();
    if (!user) {
      return null;
    }

    return user.accessToken;
  }

  public IsLoggedIn() {
    return this.getUser() != null;
  }

  public removeUser() {
    sessionStorage.removeItem(UserUtils.userKey);
  }

  public setUser(user: User) {
    sessionStorage.setItem(UserUtils.userKey, JSON.stringify(user));
  }
}
