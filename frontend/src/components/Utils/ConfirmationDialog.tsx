import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography
} from '@mui/material';
import { Close } from '@mui/icons-material';

type Props = {
  onConfirm: () => void;
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
};

function ConfirmDialog(props: Props) {
  return (
    <Dialog open={props.open} maxWidth="sm" fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={() => props.onClose()}>
          <Close />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>{props.content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() => props.onClose()}
        >
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => props.onConfirm()}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
