import { useContext } from 'react';
import './App.css';
import { AuthContext, AuthContextProvider } from './components/AuthContext';
import { CodeEditorWithSyntax } from './components/CodeEditorWithSyntax/CodeEditorWithSyntax';
import SignUp from './components/SignUp/SignUp';
import TopAlert from './components/Utils/TopAlert';
import UserService from './services/user.service';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  styled
} from '@mui/material';

const userService = UserService.getInstance();

function Auth() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Grid container direction="column" alignItems="center">
      {!isLoggedIn ? (
        <Grid item>
          <SignUp />
        </Grid>
      ) : (
        <Grid item>
          <Button
            variant="contained"
            color="error"
            onClick={() => userService.signOut()}
          >
            Sign Out
          </Button>
        </Grid>
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
          <Grid container spacing={2} height="100%" style={{ marginTop: 0 }}>
            <Grid item xs={12} md={3} lg={3}>
              <Card style={{ height: '100%' }}>
                {/* The padding bottom is 24px, and the top is 16px */}
                <CardContent
                  style={{
                    position: 'relative',
                    height: 'calc(100% - 40px)'
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
        </AuthContextProvider>
      </Box>
    </Container>
  );
}

export default App;
