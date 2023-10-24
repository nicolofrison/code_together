import CodeWithText from '../models/http/responses/codeWithText.interface';
import Code from '../models/interfaces/code.interface';
import UserSession from '../models/interfaces/userSession.interface';
import { Observable } from './Observer';

export default class UserUtils extends Observable<boolean> {
  private static readonly userKey = 'user';
  private static readonly codeKey = 'code';

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

  public get user(): UserSession | null {
    const jsonUser = sessionStorage.getItem(UserUtils.userKey);
    if (!jsonUser) {
      this.isLoggedIn = false;
      return null;
    }

    const user = JSON.parse(jsonUser);
    if (!user.accessToken) {
      this.removeUser();
      return null;
    }

    this.isLoggedIn = true;

    return user;
  }
  private set user(value: UserSession | null) {
    if (value) {
      sessionStorage.setItem(UserUtils.userKey, JSON.stringify(value));
      this.isLoggedIn = true;
    } else {
      sessionStorage.removeItem(UserUtils.userKey);
      this.isLoggedIn = false;
    }
  }

  private static instance: UserUtils;
  public static getInstance(): UserUtils {
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

  public removeUser() {
    this.user = null;
  }

  public removeCode() {
    sessionStorage.removeItem(UserUtils.codeKey);
  }

  public setUser(user: UserSession) {
    this.user = user;
  }

  public getCode(): Code | null {
    const jsonCode = sessionStorage.getItem(UserUtils.codeKey);
    if (!jsonCode) {
      this.isLoggedIn = false;
      return null;
    }

    const code = JSON.parse(jsonCode);
    if (!code) {
      this.removeCode();
      return null;
    }

    return code;
  }

  setCode(code: Code) {
    sessionStorage.setItem(UserUtils.codeKey, JSON.stringify(code));
  }
}
