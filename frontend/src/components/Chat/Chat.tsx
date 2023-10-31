import { useEffect, useRef, useState } from 'react';

import {
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { Send } from '@mui/icons-material';

import ChatMessage from '../../models/interfaces/chatMessage.interface';
import { ChatData } from '../../models/interfaces/webSocketMessage.interface';

import UserUtils from '../../utils/UserUtils';

import WebSocketService from '../../services/webSocket.service';

import './Chat.css';

const userUtils = UserUtils.getInstance();
const webSocketService = WebSocketService.getInstance();

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messagesList, setMessagesList] = useState([] as ChatMessage[]);
  const messagesListRef: React.MutableRefObject<ChatMessage[]> = useRef([]);

  messagesListRef.current = messagesList;

  const [isWSConnected, setIsWsConnected] = useState(false);

  const currentUsername = userUtils.user?.email;

  useEffect(() => {
    webSocketService.setOnChatCallback((data: ChatData) => {
      setMessagesList([...messagesListRef.current, { ...data } as ChatMessage]);
    });
    webSocketService.addOnConnectedCallback((isConnected: boolean) => {
      setIsWsConnected(isConnected);
    });
  }, []);

  const sendMessage = () => {
    webSocketService.sendMessage({
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
      direction="column"
      flexWrap="nowrap"
      style={{ marginTop: 0 }}
    >
      <Grid item style={{ paddingTop: 0 }}>
        <Typography textAlign="center" component="h1" variant="h5">
          Chat
        </Typography>
      </Grid>
      <Grid item flexGrow={2} width="100%" overflow="auto">
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
