import CodeEditor from '@uiw/react-textarea-code-editor';
import { useState } from 'react';

export function CodeEditorWithSyntax(): JSX.Element {
  const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`);
  return (
    <CodeEditor
      value={code}
      language="js"
      placeholder="Please enter JS code."
      onChange={(e) => setCode(e.target.value)}
      padding={15}
      style={{
        fontSize: 12,
        fontFamily:
          'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        width: '100%',
        height: '100%'
      }}
    />
  );
}
