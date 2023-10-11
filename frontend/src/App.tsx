import { useContext } from 'react';
import './App.css';
import { AuthContext, AuthContextProvider } from './components/AuthContext';
import { CodeEditorWithSyntax } from './components/CodeEditorWithSyntax/CodeEditorWithSyntax';
import SignUp from './components/SignUp/SignUp';
import TopAlert from './components/Utils/TopAlert';
import userService from './services/user.service';

function Auth() {
  const isLoggedIn = useContext(AuthContext);

  return (
    <>
      {!isLoggedIn ? (
        <SignUp />
      ) : (
        <button onClick={() => userService.signOut()}>Sign Out</button>
      )}
    </>
  );
}

function App() {
  return (
    <>
      <TopAlert />
      <div className="App">
        <AuthContextProvider>
          <div
            style={{
              width: '50%',
              height: '50vh',
              border: '1px solid black',
              overflow: 'auto'
            }}
          >
            <CodeEditorWithSyntax />
          </div>
          <Auth />
        </AuthContextProvider>
      </div>
    </>
  );
}

export default App;
