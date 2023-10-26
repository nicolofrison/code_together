import { useContext } from 'react';

import { Button, Card, CardContent, Grid } from '@mui/material';

import UserService from '../../services/user.service';

import { AuthContext } from '../AuthContext';
import Chat from '../Chat/Chat';
import { CodeEditorWithSyntax } from '../CodeEditorWithSyntax/CodeEditorWithSyntax';
import CodeHistoryList from '../CodeHistory/CodeHistoryList';
import SignUp from '../SignUp/SignUp';
import CardItem from './CardItem';

const userService = UserService.getInstance();

function Auth() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Grid container justifyContent="center" height="100%" spacing={2}>
      {!isLoggedIn ? (
        <Grid item>
          <SignUp />
        </Grid>
      ) : (
        <>
          <Grid item style={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => userService.signOut()}
            >
              Sign Out
            </Button>
          </Grid>
          <Grid item height="calc(100% - 40px)">
            <CodeHistoryList />
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default function MainLayout() {
  return (
    <Grid container spacing={2} height="100%" style={{ marginTop: 0 }}>
      <Grid style={{ height: '100%' }} item xs={12} md={3} lg={3}>
        <CardItem>
          <Auth />
        </CardItem>
      </Grid>
      <Grid item xs={12} md={6} lg={6} overflow={'auto'}>
        <CardItem>
          <CodeEditorWithSyntax />
        </CardItem>
      </Grid>
      <Grid style={{ height: '100%' }} item xs={12} md={3} lg={3}>
        <CardItem>
          <Chat />
        </CardItem>
      </Grid>
    </Grid>
  );
}
