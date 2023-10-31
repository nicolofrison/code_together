import { Container } from '@mui/material';

import { AuthContextProvider } from './components/contexts/AuthContext';
import { CodeHistoryContextProvider } from './components/contexts/CodeHistoryContext';
import TopAlert from './components/Utils/TopAlert';
import MainLayout from './components/Layout/mainLayout';

function App() {
  return (
    <>
      <TopAlert />
      <Container
        style={{ position: 'relative', height: '100vh', paddingBottom: '16px' }}
      >
        <AuthContextProvider>
          <CodeHistoryContextProvider>
            <MainLayout />
          </CodeHistoryContextProvider>
        </AuthContextProvider>
      </Container>
    </>
  );
}

export default App;
