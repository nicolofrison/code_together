import User from '../../interfaces/user.interface';
import CodeHistory from '../../interfaces/codeHistory.interface';

export default interface UserSignInResponse extends User {
  accessToken: string;
  wsCode: string;
  lastCodeHistory: CodeHistory;
}
