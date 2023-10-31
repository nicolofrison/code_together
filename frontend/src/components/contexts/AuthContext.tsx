import { useState, createContext, useEffect } from 'react';

import UserUtils from '../../utils/UserUtils';

import WebSocketService from '../../services/webSocket.service';

import WebSocketCodeDialog from '../Utils/WebSocketCodeDialog';

export const AuthContext = createContext<{
  isLoggedIn: boolean;
  wsCode: string;
  defaultWsCode: string;
}>({ isLoggedIn: false, defaultWsCode: '', wsCode: '' });

type Props = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    UserUtils.getInstance().isLoggedIn
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [defaultWsCode, setDefaultWsCode] = useState('');
  const [wsCode, setWsCode] = useState('');

  useEffect(() => {
    UserUtils.getInstance().attach({
      update(value: boolean) {
        console.log('update: ' + value);
        setIsLoggedIn(value);
      }
    });
  }, []);

  useEffect(() => {
    console.log('effect');
    setDefaultWsCode(UserUtils.getInstance().getDefaultWsCode());
    if (isLoggedIn) {
      setIsDialogOpen(true);
    } else {
      WebSocketService.getInstance().closeSocket();
      setDefaultWsCode('');
      setWsCode('');
    }
  }, [isLoggedIn]);

  const onTokenSubmit = (t: string) => {
    setWsCode(t);
    WebSocketService.getInstance().connectSocket(t);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, defaultWsCode, wsCode }}>
      {isDialogOpen && (
        <WebSocketCodeDialog
          onSubmit={onTokenSubmit}
          open={isDialogOpen}
          handleClose={() => setIsDialogOpen(false)}
          defaultWsCode={defaultWsCode}
        />
      )}
      {children}
    </AuthContext.Provider>
  );
};
