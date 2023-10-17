import { Request } from 'express';
import User from '../../entities/User';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
