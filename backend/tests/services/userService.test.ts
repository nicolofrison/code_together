import User from '../../src/models/entities/User';
import { userService } from '../../src/services/user.service';
import { userRepository } from '../../src/repositories/user.repository';
import RecordNotFoundError from '../../src/models/exceptions/RecordNotFoundError';
import RecordAlreadyExistsError from '../../src/models/exceptions/RecordAlreadyExistsError';
import AuthenticationUtils from '../../src/utils/authentication';
import WrongPasswordError from '../../src/models/exceptions/WrongPasswordError';

describe('UserService', () => {
  describe('findById', () => {
    jest.mock('../../src/repositories/user.repository', () => jest.fn());

    test('findById user found', async () => {
      const expectedUser = new User('email', 'password');
      userRepository.findOneBy = jest.fn(() => Promise.resolve(expectedUser));

      const user = await userService.findById(1);
      expect(user).toBe(expectedUser);
      expect(user).not.toHaveProperty('password');
    });

    test('findById user not found', async () => {
      userRepository.findOneBy = jest.fn(() => Promise.resolve(null));

      await expect(userService.findById(1)).rejects.toThrow(RecordNotFoundError);
    });
  });

  describe('createUser', () => {
    test('createUser user created successfully', async () => {
      const email = 'vjoebwnviubie@venwv';
      const password = 'fbht45h54hwe4w4h5';

      const authData = { email, password };
      userRepository.findByEmail = jest.fn(() => Promise.resolve(null));
      let expectedUser;
      userRepository.createAndSave = jest.fn((e, p) => {
        expectedUser = { email: e, password: p, id: 1 };
        return Promise.resolve(expectedUser);
      });

      const user = await userService.createUser(authData);
      expect(user.id).toBe(expectedUser.id);
      expect(user.email).toBe(expectedUser.email);
      expect(user).not.toHaveProperty('password');
    });

    test('findById user with same email exists', async () => {
      const email = 'vjoebwnviubie@venwv';
      const password = 'fbht45h54hwe4w4h5';

      const authData = { email, password };
      let findByEmailParam;
      userRepository.findByEmail = jest.fn((param) => {
        findByEmailParam = param;
        return Promise.resolve(new User(email, password));
      });

      try {
        await userService.createUser(authData);
        throw new Error('The createUser should throw RecordAlreadyExistsError');
      } catch (e) {
        expect(e).toBeInstanceOf(RecordAlreadyExistsError);
        expect(findByEmailParam).toBe(email);
      }
    });
  });

  describe('signIn', () => {
    test('signIn user signs in successfully', async () => {
      const email = 'vjoebwnviubie@venwv';
      const password = 'fbht45h54hwe4w4h5';
      const hashedPassword = await AuthenticationUtils.hash(password);

      const expectedUser = { id: 1, email, password: hashedPassword };
      const authData = { email, password };
      userRepository.findByEmail = jest.fn(() => Promise.resolve(expectedUser));

      const user = await userService.signIn(authData);
      expect(user.id).toBe(expectedUser.id);
      expect(user.email).toBe(expectedUser.email);
      expect(user).not.toHaveProperty('password');
    });

    test('signIn email not found', async () => {
      const email = 'vjoebwnviubie@venwv';
      const password = 'fbht45h54hwe4w4h5';

      const authData = { email, password };
      userRepository.findByEmail = jest.fn(() => Promise.resolve(null));

      await expect(userService.signIn(authData)).rejects.toThrow(
        RecordNotFoundError
      );
    });

    test('signIn password is wrong', async () => {
      const email = 'vjoebwnviubie@venwv';
      const password = 'fbht45h54hwe4w4h5';

      const authData = { email, password };
      const hashedPassword = await AuthenticationUtils.hash('differentPassword');
      userRepository.findByEmail = jest.fn(() =>
        Promise.resolve({ id: 1, email, password: hashedPassword })
      );

      await expect(userService.signIn(authData)).rejects.toThrow(
        WrongPasswordError
      );
    });
  });
});
