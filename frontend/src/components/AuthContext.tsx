import { useState, createContext } from 'react';
import UserUtils from '../utils/UserUtils';

export const AuthContext = createContext<boolean>(
  UserUtils.getInstance().isLoggedIn
);

type Props = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    UserUtils.getInstance().isLoggedIn
  );

  UserUtils.getInstance().attach({
    update(value: boolean) {
      console.log('update: ' + value);
      setIsLoggedIn(value);
    }
  });

  return (
    <AuthContext.Provider value={isLoggedIn}>{children}</AuthContext.Provider>
  );
};
