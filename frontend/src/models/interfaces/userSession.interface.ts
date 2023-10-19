import CodeHistory from './codeHistory.interface';

export default interface UserSession {
  id: number;
  email: string;
  accessToken: string;
  wsCode: string;
  lastCodeHistory: CodeHistory;
}
