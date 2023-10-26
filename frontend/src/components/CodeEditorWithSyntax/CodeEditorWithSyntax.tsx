import React, {
  ChangeEventHandler,
  useContext,
  useEffect,
  useState
} from 'react';

import { AxiosError } from 'axios';

import CodeEditor from '@uiw/react-textarea-code-editor';
// library used by react-textarea-code-editor
import { refractor } from 'refractor/lib/core.js';

import { Button, Grid } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Code from '../../models/interfaces/code.interface';
import { CodeData } from '../../models/interfaces/webSocketMessage.interface';
import CodeHistoryPost from '../../models/http/requests/codeHistoryPost';
import UserSession from '../../models/interfaces/userSession.interface';

import handleError from '../../utils/errorHandler';
import UserUtils from '../../utils/UserUtils';

import AlertService from '../../services/alert.service';
import WebSocketService from '../../services/webSocket.service';
import CodeService from '../../services/code.service';
import CodeHistoryService from '../../services/codeHistory.service';

import { AuthContext } from '../AuthContext';
import { CodeHistoryContext } from '../contexts/CodeHistoryContext';
import CommitDialog from '../Utils/CommitDialog';
import { AlertType } from '../Utils/TopAlert';

import './CodeEditorWithSyntax.css';

const alertService = AlertService.getInstance();
const codeService = CodeService.getInstance();
const codeHistoryService = CodeHistoryService.getInstance();

export function CodeEditorWithSyntax(): JSX.Element {
  const [text, setText] = useState(``);
  const [isFirstCodeReceived, setIsFirstCodeReceived] = useState(false);
  const [isWSConnected, setIsWsConnected] = useState(false);
  const [language, setLanguage] = useState('javascript');

  const [code, setCode] = useState(null as Code | null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const languages = refractor.listLanguages();

  const { isLoggedIn, defaultWsCode, wsCode } = useContext(AuthContext);
  const { codeId, updateCodeHistoryList } = useContext(CodeHistoryContext);

  async function updateCodeById(id: number, isSetText = false) {
    const codeWithText = await codeService.getCode(id);

    const codeWithoutText = { ...codeWithText } as any;
    delete codeWithoutText.text;
    setCode(codeWithoutText as Code);
    codeId.set(id);

    if (isSetText) {
      setText(codeWithText.text);
    }
  }

  useEffect(() => {
    if (isLoggedIn && wsCode && wsCode === defaultWsCode) {
      codeService.getCodes().then((codes) => {
        if (codes.length > 0) {
          updateCodeById(codes[0].id, true);
        }
      });
    }
  }, [wsCode]);

  useEffect(() => {
    WebSocketService.getInstance().setOnCodeCallback((data: CodeData) => {
      if (!isFirstCodeReceived) {
        setIsFirstCodeReceived(true);
      }
      setText(data.text);
    });
    WebSocketService.getInstance().addOnConnectedCallback(
      (isConnected: boolean) => {
        console.log('onOpen');
        setIsWsConnected(isConnected);
      }
    );
  }, []);

  const isAllowedToWrite = () => {
    // is not logged in (normal editor without sharing)
    // is logged in && ws connected && wsCode is created
    // is logged in && ws connected && wsCode is joined && received the code at least once
    return (
      !isLoggedIn ||
      (isWSConnected && (defaultWsCode === wsCode || isFirstCodeReceived))
    );
  };

  const onChange: ChangeEventHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    console.log(e);
    if (isAllowedToWrite()) {
      setText(e.target.value);

      if (isLoggedIn) {
        const codeData: CodeData = { text: e.target.value };
        WebSocketService.getInstance().sendCode(codeData);
      }
    }
  };

  const onCommitSubmit = async (comment: string) => {
    const user = UserUtils.getInstance().user as UserSession;

    const codeHistoryPost: CodeHistoryPost = {
      codeId: code ? code.id : user.id.toString(),
      comment,
      text: text
    };

    try {
      const codeHistory =
        await codeHistoryService.createCodeHistory(codeHistoryPost);

      alertService.showAlert(
        `Commit submitted successfully with commit sha: ${codeHistory.commit_sha}`,
        AlertType.success
      );

      if (!code) {
        updateCodeById(codeHistory.codeId);
      }

      updateCodeHistoryList.set(!updateCodeHistoryList.get);
    } catch (e) {
      handleError(e as Error | AxiosError);
    }
  };

  return (
    <Grid container direction="column" alignItems="stretch" height="100%">
      <CommitDialog
        onSubmit={onCommitSubmit}
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
      />
      <Grid
        width="100%"
        container
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item>{wsCode ? `Connected to ${wsCode}` : <br />}</Grid>
        <Grid item>
          <Select
            labelId="language-select-label"
            id="language-select"
            value={language}
            label="Language"
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((l) => (
              <MenuItem key={l} value={l}>
                {l[0].toUpperCase() + l.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        {isLoggedIn && wsCode === defaultWsCode && (
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsDialogOpen(true)}
            >
              Commit
            </Button>
          </Grid>
        )}
      </Grid>
      <Grid flexGrow={1}>
        <CodeEditor
          disabled={!isAllowedToWrite()}
          value={text}
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
  );
}
