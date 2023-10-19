import User from './user.interface';
import CodeHistory from './codeHistory.interface';

export default interface UserSession extends User {
  accessToken: string;
  wsCode: string;
  lastCodeHistory: CodeHistory;
}
