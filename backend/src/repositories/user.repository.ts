import { appDataSource } from '../config/dataSource';
import { User } from '../entities/User';

export const userRepository = appDataSource.getRepository(User).extend({});
