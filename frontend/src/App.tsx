import { useContext } from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack
} from '@mui/material';

import { AuthContext, AuthContextProvider } from './components/AuthContext';
import { CodeEditorWithSyntax } from './components/CodeEditorWithSyntax/CodeEditorWithSyntax';
import SignUp from './components/SignUp/SignUp';
import TopAlert from './components/Utils/TopAlert';

import UserService from './services/user.service';
import CodeHistoryList from './components/CodeHistory/CodeHistoryList';
import { CodeHistoryContextProvider } from './components/contexts/CodeHistoryContext';

const userService = UserService.getInstance();

function Auth() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Grid alignItems="center" height="100%">
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

function App() {
  return (
    <Container
      style={{ position: 'relative', height: '100vh', paddingBottom: '16px' }}
    >
      <TopAlert />
      <Box height="100%">
        <AuthContextProvider>
          <CodeHistoryContextProvider>
            <Grid container spacing={2} height="100%" style={{ marginTop: 0 }}>
              <Grid style={{ height: '100%' }} item xs={12} md={3} lg={3}>
                <Card style={{ height: '100%' }}>
                  {/* The padding bottom is 24px, and the top is 16px */}
                  <CardContent
                    style={{
                      position: 'relative',
                      height: 'calc(100% - 32px)',
                      paddingBottom: '16px'
                    }}
                  >
                    <Auth />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={9} lg={9} overflow={'auto'}>
                <Card style={{ height: '100%' }}>
                  {/* The padding bottom is 24px */}
                  <CardContent
                    style={{
                      position: 'relative',
                      paddingTop: 0,
                      height: 'calc(100% - 24px)'
                    }}
                  >
                    <CodeEditorWithSyntax />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CodeHistoryContextProvider>
        </AuthContextProvider>
      </Box>
    </Container>
  );
}

export default App;
