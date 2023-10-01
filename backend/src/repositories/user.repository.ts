import { appDataSource } from '../config/dataSource';
import { User } from '../models/entities/User';

export const userRepository = appDataSource.getRepository(User).extend({});
