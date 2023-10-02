class HttpError extends Error {
  public status: number;
  public translationKey: string;

  constructor(status: number, message: string, translationKey: string) {
    super(message);
    this.status = status;
    this.translationKey = translationKey;
  }
}

export default HttpError;
