import User from '../models/interfaces/user.interface';

export default class UserUtils {
  private static readonly userKey = 'user';

  public static getUser(): User | null {
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

  public static getToken(): string | null {
    const user = this.getUser();

    if (!user) {
      return null;
    }

    return user.accessToken;
  }

  public static IsLoggedIn() {
    return this.getUser() != null;
  }

  public static removeUser() {
    sessionStorage.removeItem(UserUtils.userKey);
  }

  public static setUser(user: User) {
    sessionStorage.setItem(UserUtils.userKey, JSON.stringify(user));
  }
}
