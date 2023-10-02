import * as bcrypt from 'bcrypt';

export default class AuthenticationUtils {
  public static hash = async (toHash: string) => bcrypt.hash(toHash, 10);

  public static passwordIsEqualToHashed = async (
    plain: string,
    hashed: string
  ): Promise<boolean> => bcrypt.compare(plain, hashed);
}
