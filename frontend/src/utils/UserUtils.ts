import CodeHistory from '../models/interfaces/codeHistory.interface';
import User from '../models/interfaces/user.interface';
import { Observable } from './Observer';

export default class UserUtils extends Observable<boolean> {
  private static readonly userKey = 'user';

  private _isLoggedIn: boolean | undefined;
  public get isLoggedIn(): boolean {
    if (this._isLoggedIn === undefined) {
      this.user;
    }

    return this._isLoggedIn as boolean;
  }
  private set isLoggedIn(value: boolean) {
    let toNotify = false;
    if (this._isLoggedIn != value) {
      toNotify = true;
    }

    this._isLoggedIn = value;

    if (toNotify) {
      this.notify(this.isLoggedIn);
    }
  }

  public get user(): User | null {
    const jsonUser = sessionStorage.getItem(UserUtils.userKey);
    console.log(jsonUser);
    if (!jsonUser) {
      this.isLoggedIn = false;
      return null;
    }

    const user = JSON.parse(jsonUser);
    console.debug(user);
    if (!user.accessToken) {
      this.removeUser();
      return null;
    }

    this.isLoggedIn = true;

    return user;
  }
  private set user(value: User | null) {
    if (value) {
      sessionStorage.setItem(UserUtils.userKey, JSON.stringify(value));
      this.isLoggedIn = true;
    } else {
      sessionStorage.removeItem(UserUtils.userKey);
      this.isLoggedIn = false;
    }
  }

  private static instance: UserUtils;
  public static getInstance() {
    if (!this.instance) {
      this.instance = new UserUtils();
    }

    return this.instance;
  }

  public getToken(): string | null {
    const user = this.user;

    if (!user) {
      return null;
    }

    return user.accessToken;
  }

  public getDefaultWsCode(): string {
    const user = this.user;

    if (!user) {
      return '';
    }

    return user.wsCode;
  }

  public setLastCodeHistory(codeHistory: CodeHistory) {
    if (!this.isLoggedIn || !this.user) {
      return;
    }

    this.user = { ...this.user, lastCodeHistory: codeHistory };
  }

  public getLastCodeHistory(): CodeHistory | null {
    const user = this.user;

    if (!user) {
      return null;
    }

    return user.lastCodeHistory;
  }

  public removeUser() {
    this.user = null;
  }

  public setUser(user: User) {
    this.user = user;
  }
}
