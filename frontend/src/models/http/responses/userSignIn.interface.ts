import User from '../../interfaces/user.interface';

export default interface UserSignInResponse extends User {
  accessToken: string;
  wsCode: string;
}
