import axios, { AxiosError } from 'axios';
import alertService from '../services/alert.service';
import { AlertType } from '../components/Utils/TopAlert';
import userService from '../services/user.service';

export default function handleError(error: Error | AxiosError) {
  if (axios.isAxiosError(error)) {
    // Access to config, request, and response
    console.error(error);

    const errorResponse = error.response;
    const errorMessage = errorResponse?.data?.message ?? error.message;
    alertService.showAlert(errorMessage, AlertType.error);

    if (errorResponse?.status === 409) {
      userService.signOut();
    }
  } else {
    // Just a stock error
    console.error(error);
    alertService.showAlert(error.message, AlertType.error);
  }
}
