import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';

enum CodeAction {
  CREATE,
  JOIN
}

type Props = {
  onSubmit: (wsCode: string) => void;
  open: boolean;
  handleClose: () => void;
};

const wsCodeFormat = new Intl.NumberFormat('en-US', {
  minimumIntegerDigits: 6,
  useGrouping: false
});

export const defaultWsCode = wsCodeFormat.format(
  Math.floor(Math.random() * 999999) + 1
);

export default function WebSocketCodeDialog(props: Props) {
  const { onSubmit, open, handleClose } = props;

  const [wsCode, setWsCode] = useState(defaultWsCode);

  const isWsCodeValid = (t: string) => {
    const reg = new RegExp('[0-9]{6}');
    return reg.test(t);
  };

  const [error, setError] = useState('');
  const handleValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(
      isWsCodeValid(e.target.value)
        ? ''
        : 'The shared code should be composed by exactly 6 numbers'
    );
    setWsCode(e.target.value);
  };

  const setAction = (action: CodeAction) => {
    if (action === CodeAction.CREATE) {
      if (wsCode === defaultWsCode) {
        onSubmit(wsCode);
        handleClose();
      } else {
        setWsCode(defaultWsCode);
      }
    } else {
      if (wsCode === defaultWsCode) {
        setWsCode('');
      } else if (isWsCodeValid(wsCode)) {
        onSubmit(wsCode);
        handleClose();
      }
    }
  };

  const checkDisable = () => {
    console.log(wsCode);
    console.log(defaultWsCode);
    return wsCode === defaultWsCode;
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
          <TextField
            autoFocus
            margin="dense"
            id="wsCode"
            label="Shared code"
            fullWidth
            variant="standard"
            type="numeric"
            disabled={checkDisable()}
            onChange={handleValidation}
            error={error ? true : false}
            helperText={error}
            value={wsCode}
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!isWsCodeValid(wsCode)}
            onClick={() => setAction(CodeAction.JOIN)}
          >
            Join
          </Button>
          <Button onClick={() => setAction(CodeAction.CREATE)} autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
