import { useState } from 'react';

import { Grid, List, ListItem, Paper, Stack, TextField } from '@mui/material';
import ChatMessage from '../../models/interfaces/chatMessage.interface';

import './Chat.css';
import UserUtils from '../../utils/UserUtils';

const exampleMessages = [
  {
    from: 'user1',
    message: 'hi user 2'
  },
  {
    from: 'a@a.com',
    message: 'hi user 1'
  },
  {
    from: 'a@a.com',
    message: 'how are you?'
  },
  {
    from: 'user1',
    message: 'so far so good'
  },
  {
    from: 'user1',
    message: 'what about you?'
  },
  {
    from: 'a@a.com',
    message: 'Same shit'
  },
  {
    from: 'user1',
    message: 'hi user 2'
  },
  {
    from: 'a@a.com',
    message: 'hi user 1'
  },
  {
    from: 'a@a.com',
    message: 'how are you?'
  },
  {
    from: 'user1',
    message: 'so far so good'
  },
  {
    from: 'user1',
    message: 'what about you?'
  },
  {
    from: 'a@a.com',
    message: 'Same shit'
  }
] as ChatMessage[];

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messagesList, setMessagesList] = useState(exampleMessages);

  const currentUsername = UserUtils.getInstance().user?.email;

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
      <Grid item style={{ paddingTop: 0 }}>
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
    </Grid>
  );
}
