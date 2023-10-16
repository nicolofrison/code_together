import { useState, createContext, useEffect } from 'react';
import UserUtils from '../utils/UserUtils';
import WebSocketService from '../services/webSocket.service';
import CreateJoinSharedCodeDialog from './Utils/CreateJoinSharedCodeDialog';

export const AuthContext = createContext<{
  isLoggedIn: boolean;
  wsCode: string;
}>({ isLoggedIn: false, wsCode: '' });

type Props = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    UserUtils.getInstance().isLoggedIn
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [wsCode, setWsCode] = useState('');

  UserUtils.getInstance().attach({
    update(value: boolean) {
      console.log('update: ' + value);
      setIsLoggedIn(value);
    }
  });

  useEffect(() => {
    console.log('effect');
    if (isLoggedIn) {
      setIsDialogOpen(true);
    } else {
      WebSocketService.getInstance().closeSocket();
    }
  }, [isLoggedIn]);

  const onTokenSubmit = (t: string) => {
    setWsCode(t);
    WebSocketService.getInstance().connectSocket(t);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, wsCode }}>
      <CreateJoinSharedCodeDialog
        onSubmit={onTokenSubmit}
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
      />
      {children}
    </AuthContext.Provider>
  );
};
