import './App.css';
import { CodeEditorWithSyntax } from './components/CodeEditorWithSyntax/CodeEditorWithSyntax';
import SignUp from './components/SignUp/SignUp';

function App() {
  return (
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
      <SignUp />
    </div>
  );
}

export default App;
