import UserSession from './userSession.interface';

export default interface Code {
  id: number;
  name: string;
  owner: UserSession;
  ownerId: number;
}
