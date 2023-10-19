import { AlertType } from '../components/Utils/TopAlert';

export default class AlertService {
  private static instance: AlertService;

  private setAlertVisibleTimeout: number | undefined;

  private setAlertVisible:
    | React.Dispatch<React.SetStateAction<boolean>>
    | undefined;
  private setAlertText:
    | React.Dispatch<React.SetStateAction<string>>
    | undefined;
  private setAlertType:
    | React.Dispatch<React.SetStateAction<AlertType>>
    | undefined;

  public static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }

    return AlertService.instance;
  }

  public init(
    setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setAlertText: React.Dispatch<React.SetStateAction<string>>,
    setAlertType: React.Dispatch<React.SetStateAction<AlertType>>
  ) {
    this.setAlertVisible = setAlertVisible;
    this.setAlertText = setAlertText;
    this.setAlertType = setAlertType;
  }

  public showAlert(text: string, type: AlertType) {
    if (this.setAlertVisibleTimeout) {
      window.clearTimeout(this.setAlertVisibleTimeout);
    }

    if (this.setAlertText && this.setAlertType && this.setAlertVisible) {
      this.setAlertVisible(false);

      this.setAlertText(text);
      this.setAlertType(type);

      this.setAlertVisible(true);
      window.setTimeout(
        () => (this.setAlertVisible ? this.setAlertVisible(false) : {}),
        5000
      );
    }
  }
}
