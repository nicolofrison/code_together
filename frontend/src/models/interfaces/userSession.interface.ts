import User from './user.interface';

export default interface UserSession extends User {
  accessToken: string;
  wsCode: string;
}
