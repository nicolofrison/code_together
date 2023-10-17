import UserResponse from './user.interface';

export default interface UserSignInResponse extends UserResponse {
  accessToken: string;
  wsCode: string;
}
