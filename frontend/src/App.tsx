import './App.css';
import { CodeEditorWithSyntax } from './components/CodeEditorWithSyntax';

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
    </div>
  );
}

export default App;
