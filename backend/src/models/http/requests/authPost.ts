import { IsString } from 'class-validator';

export default class AuthPost {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
