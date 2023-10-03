import CodeEditor from '@uiw/react-textarea-code-editor';
import { useState } from 'react';
// library used by react-textarea-code-editor
import { refractor } from 'refractor/lib/core.js';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import './CodeEditorWithSyntax.css';

export function CodeEditorWithSyntax(): JSX.Element {
  const [code, setCode] = useState(``);
  const [language, setLanguage] = useState('javascript');
  // used to keep the opacity when the select is expanded, otherwise it would lose it
  const [selectIsExpanded, setSelectIsExpanded] = useState(false);

  const languages = refractor.listLanguages();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Select
        labelId="language-select-label"
        className={'language-select ' + (selectIsExpanded ? 'expanded' : '')}
        id="language-select"
        value={language}
        label="Language"
        onOpen={() => setSelectIsExpanded(true)}
        onClose={() => setSelectIsExpanded(false)}
        onChange={(e) => setLanguage(e.target.value)}
      >
        {languages.map((l) => (
          <MenuItem key={l} value={l}>
            {l[0].toUpperCase() + l.slice(1)}
          </MenuItem>
        ))}
      </Select>
      <CodeEditor
        value={code}
        language={language}
        placeholder={`Please enter ${language} code.`}
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
    </div>
  );
}
