import { useEffect, useRef, useState } from 'react';

import {
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField
} from '@mui/material';
import { Send } from '@mui/icons-material';

import ChatMessage from '../../models/interfaces/chatMessage.interface';
import { ChatData } from '../../models/interfaces/webSocketMessage.interface';

import './Chat.css';
import UserUtils from '../../utils/UserUtils';

import WebSocketService from '../../services/webSocket.service';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messagesList, setMessagesList] = useState([] as ChatMessage[]);
  const messagesListRef: React.MutableRefObject<ChatMessage[]> = useRef([]);

  messagesListRef.current = messagesList;

  const [isWSConnected, setIsWsConnected] = useState(false);

  const currentUsername = UserUtils.getInstance().user?.email;

  useEffect(() => {
    WebSocketService.getInstance().setOnChatCallback((data: ChatData) => {
      setMessagesList([...messagesListRef.current, { ...data } as ChatMessage]);
    });
    WebSocketService.getInstance().addOnConnectedCallback(
      (isConnected: boolean) => {
        setIsWsConnected(isConnected);
      }
    );
  }, []);

  const sendMessage = () => {
    WebSocketService.getInstance().sendMessage({
      from: currentUsername as string,
      message
    });
    setMessage('');
  };

  return (
    <Grid
      container
      justifyContent="center"
      height="100%"
      spacing={2}
      style={{ marginTop: 0 }}
    >
      <Grid
        item
        width="100%"
        height="calc(100% - 60px)"
        style={{ overflowY: 'auto' }}
      >
        <List>
          {messagesList.map((m, i) => (
            <ListItem
              key={i}
              className={m.from === currentUsername ? 'own-message' : ''}
            >
              <Paper elevation={2} style={{ padding: '8px' }}>
                <span>
                  <b>{m.from}</b>
                </span>
                <br />
                <span>{m.message}</span>
              </Paper>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid
        item
        container
        style={{ paddingTop: 0 }}
        alignItems="center"
        wrap="nowrap"
      >
        <Grid item>
          <TextField
            autoFocus
            margin="dense"
            id="wsCode"
            label="Message"
            fullWidth
            variant="standard"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </Grid>
        <Grid item>
          <IconButton
            disabled={!isWSConnected}
            color="primary"
            onClick={() => sendMessage()}
          >
            <Send />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
}
