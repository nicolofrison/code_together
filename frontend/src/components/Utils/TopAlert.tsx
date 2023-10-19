import { useState } from 'react';

import { Alert, AlertTitle, Collapse } from '@mui/material';

import AlertService from '../../services/alert.service';

const alertService = AlertService.getInstance();

export enum AlertType {
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error'
}

export default function TopAlert() {
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [alertType, setAlertType] = useState(AlertType.info);

  alertService.init(setAlertVisible, setAlertText, setAlertType);

  return (
    <Collapse
      in={isAlertVisible}
      sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}
    >
      <Alert severity={alertType}>
        <AlertTitle>{alertType}</AlertTitle>
        {alertText}
      </Alert>
    </Collapse>
  );
}
