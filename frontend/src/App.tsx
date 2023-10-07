import './App.css';
import { CodeEditorWithSyntax } from './components/CodeEditorWithSyntax/CodeEditorWithSyntax';
import SignUp from './components/SignUp/SignUp';
import TopAlert from './components/Utils/TopAlert';

import UserUtils from './utils/UserUtils';

function App() {
  const isLoggedIn = UserUtils.IsLoggedIn();

  return (
    <>
      <TopAlert />
      <div className="App">
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
        {isLoggedIn ? 'Logged In' : ''}
        <SignUp />
      </div>
    </>
  );
}

export default App;
