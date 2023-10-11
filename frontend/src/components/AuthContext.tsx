import { useState, createContext } from 'react';
import UserUtils from '../utils/UserUtils';

export const AuthContext = createContext<boolean>(
  UserUtils.getInstance().isLoggedIn
);

type Props = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: Props) => {
  const [loggedIn, setLoggedIn] = useState(UserUtils.getInstance().isLoggedIn);

  UserUtils.getInstance().attach({
    update(value: boolean) {
      console.log('update: ' + value);
      setLoggedIn(value);
    }
  });

  return (
    <AuthContext.Provider value={loggedIn}>{children}</AuthContext.Provider>
  );
};
