import { useContext } from 'react';

import { Button, Grid } from '@mui/material';

import UserService from '../../services/user.service';

import { AuthContext } from '../contexts/AuthContext';
import SignUp from '../SignUp/SignUp';
import CodeHistoryList from '../CodeHistory/CodeHistoryList';

const userService = UserService.getInstance();

export default function LeftColumn() {
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
