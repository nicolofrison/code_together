import User from '../entities/User';

export interface DataStoredInToken {
  user: User;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}
