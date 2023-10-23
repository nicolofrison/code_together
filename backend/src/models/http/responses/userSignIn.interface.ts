import CodeHistoryWithText from './codeHistoryWithText.interface';
import UserResponse from './user.interface';

export default interface UserSignInResponse extends UserResponse {
  accessToken: string;
  wsCode: string;
  lastCodeHistory?: CodeHistoryWithText;
}
