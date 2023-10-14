import { useEffect, useState } from 'react';
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
  onSubmit: (token: string) => void;
  open: boolean;
  handleClose: () => void;
};

const tokenNumberFormat = new Intl.NumberFormat('en-US', {
  minimumIntegerDigits: 6,
  useGrouping: false
});

export const defaultCode = tokenNumberFormat.format(
  Math.floor(Math.random() * 999999) + 1
);

export default function AlertDialog(props: Props) {
  const { onSubmit, open, handleClose } = props;

  const [token, setToken] = useState(defaultCode);

  const isTokenValid = (t: string) => {
    const reg = new RegExp('[0-9]{6}');
    return reg.test(t);
  };

  const [error, setError] = useState('');
  const handleValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(
      isTokenValid(e.target.value)
        ? ''
        : 'The token should be composed by exactly 6 numbers'
    );
    setToken(e.target.value);
  };

  const setAction = (action: CodeAction) => {
    if (action === CodeAction.CREATE) {
      if (token === defaultCode) {
        onSubmit(token);
        handleClose();
      } else {
        setToken(defaultCode);
      }
    } else {
      if (token === defaultCode) {
        setToken('');
      } else if (isTokenValid(token)) {
        onSubmit(token);
        handleClose();
      }
    }
  };

  const checkDisable = () => {
    console.log(token);
    console.log(defaultCode);
    return token === defaultCode;
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
            id="token"
            label="Token"
            fullWidth
            variant="standard"
            type="numeric"
            disabled={checkDisable()}
            onChange={handleValidation}
            error={error ? true : false}
            helperText={error}
            value={token}
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!isTokenValid(token)}
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
