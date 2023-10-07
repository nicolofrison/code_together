import UserResponse from './user.interface';

export default interface UserWithTokenResponse extends UserResponse {
  accessToken: string;
}
