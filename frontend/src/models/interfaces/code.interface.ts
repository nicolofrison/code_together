import User from './user.interface';

export default interface Code {
  id: number;
  name: string;
  owner: User;
  ownerId: number;
}
