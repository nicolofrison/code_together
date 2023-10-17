import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ButtonGroup, TextField } from '@mui/material';

enum CodeAction {
  CREATE,
  JOIN
}

type Props = {
  onSubmit: (wsCode: string) => void;
  open: boolean;
  handleClose: () => void;
  defaultWsCode: string;
};

export default function WebSocketCodeDialog(props: Props) {
  const { onSubmit, open, handleClose } = props;

  const [wsCode, setWsCode] = useState('');
  const [action, setAction] = useState(CodeAction.CREATE);

  useEffect(() => {
    setWsCode(props.defaultWsCode);
  }, [props.defaultWsCode]);

  const isWsCodeValid = (code: string) => {
    const reg = new RegExp('[0-9]{6}');
    return (
      reg.test(code) &&
      (action === CodeAction.CREATE || code !== props.defaultWsCode)
    );
  };

  const [error, setError] = useState('');
  const handleValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(
      isWsCodeValid(e.target.value)
        ? ''
        : 'The shared code should be composed by exactly 6 numbers and different from the default code'
    );
    setWsCode(e.target.value);
  };

  useEffect(() => {
    if (action === CodeAction.CREATE) {
      setError('');
      setWsCode(props.defaultWsCode);
    } else {
      setWsCode('');
    }
  }, [action]);

  const submit = () => {
    if (action === CodeAction.CREATE) {
      onSubmit(props.defaultWsCode);
      handleClose();
    } else if (isWsCodeValid(wsCode)) {
      onSubmit(wsCode);
      handleClose();
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Create or Join a code session?
          </DialogContentText>
          <ButtonGroup
            aria-label="Create/Join session buttons"
            style={{ display: 'block' }}
          >
            <Button
              variant={action === CodeAction.CREATE ? 'contained' : 'outlined'}
              onClick={() => setAction(CodeAction.CREATE)}
            >
              Create Session
            </Button>
            <Button
              variant={action === CodeAction.JOIN ? 'contained' : 'outlined'}
              onClick={() => setAction(CodeAction.JOIN)}
            >
              Join Session
            </Button>
          </ButtonGroup>
          <TextField
            autoFocus
            margin="dense"
            id="wsCode"
            label="Shared code"
            fullWidth
            variant="standard"
            type="numeric"
            disabled={action === CodeAction.CREATE}
            onChange={handleValidation}
            error={error ? true : false}
            helperText={error}
            value={wsCode}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={!isWsCodeValid(wsCode)} onClick={() => submit()}>
            {action === CodeAction.CREATE ? 'Create Session' : 'Join Session'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
