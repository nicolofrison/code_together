import CodeHistory from './codeHistory.interface';

export default interface User {
  id: number;
  email: string;
  accessToken: string;
  wsCode: string;
  lastCodeHistory: CodeHistory;
}
