import React, {
  ChangeEventHandler,
  useContext,
  useEffect,
  useState
} from 'react';

import CodeEditor from '@uiw/react-textarea-code-editor';
// library used by react-textarea-code-editor
import { refractor } from 'refractor/lib/core.js';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import './CodeEditorWithSyntax.css';
import { CodeData } from '../../models/interfaces/webSocketMessage.interface';
import WebSocketService from '../../services/webSocket.service';
import { AuthContext } from '../AuthContext';
import CreateJoinSharedCodeDialog from '../Utils/CreateJoinSharedCodeDialog';
import { Grid } from '@mui/material';

export function CodeEditorWithSyntax(): JSX.Element {
  const [code, setCode] = useState(``);
  const [token, setToken] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWSConnected, setIsWsConnected] = useState(false);
  const [language, setLanguage] = useState('javascript');
  // used to keep the opacity when the select is expanded, otherwise it would lose it
  const [selectIsExpanded, setSelectIsExpanded] = useState(false);

  const languages = refractor.listLanguages();

  const isLoggedIn = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      WebSocketService.getInstance().setOnCodeCallback((data: CodeData) => {
        setCode(data.text);
      });
      WebSocketService.getInstance().addOnOpenCallbacks(
        (isConnected: boolean) => {
          console.log('onOpen');
          setIsWsConnected(isConnected);
        }
      );
      setIsDialogOpen(true);
    }
  }, [isLoggedIn]);

  const onTokenSubmit = (t: string) => {
    setToken(t);
  };

  const onChange: ChangeEventHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    console.log(e);
    setCode(e.target.value);

    if (isLoggedIn) {
      const codeData: CodeData = { text: e.target.value };
      WebSocketService.getInstance().sendCode(codeData);
    }
  };

  return (
    <>
      <CreateJoinSharedCodeDialog
        onSubmit={onTokenSubmit}
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
      />
      <Grid
        container
        height="100%"
        justifyContent="space-between"
        alignItems="stretch"
      >
        <Grid item xs={8}>
          <p>Connected to {token}</p>
        </Grid>
        <Grid item xs={4}>
          <Select
            labelId="language-select-label"
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
        </Grid>
        <Grid item xs>
          <CodeEditor
            disabled={isLoggedIn && !isWSConnected}
            value={code}
            language={language}
            placeholder={`Please enter ${language} code.`}
            onChange={onChange}
            padding={15}
            style={{
              fontSize: 12,
              fontFamily:
                'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
              width: '100%',
              height: '100%'
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
