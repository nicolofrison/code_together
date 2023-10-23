import { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';

type Props = {
  onSubmit: (wsCode: string) => void;
  open: boolean;
  handleClose: () => void;
};

export default function WebSocketCodeDialog(props: Props) {
  const { onSubmit, open, handleClose } = props;

  const [commit, setCommit] = useState('');

  const [error, setError] = useState('');
  const handleValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(e.target.value === '' ? 'The commit message cannot be empty' : '');
    setCommit(e.target.value);
  };

  const submit = () => {
    if (commit !== '') {
      onSubmit(commit);
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
        <DialogTitle id="alert-dialog-title">Commit code</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Set message for the commit
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="wsCode"
            label="Message"
            fullWidth
            variant="standard"
            onChange={handleValidation}
            error={error ? true : false}
            helperText={error}
            value={commit}
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button disabled={commit === ''} onClick={() => submit()}>
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
