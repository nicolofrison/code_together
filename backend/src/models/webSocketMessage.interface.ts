// If edited, update the same file in the frontend

export enum MessageType {
  AUTH,
  CODE
}

export interface CodeData {
  text: string;
}

export enum AuthCodes {
  REQUEST,
  SUCCESS,
  TOKEN_EXPIRED,
  TOKEN_ERROR
}

export interface AuthData {
  code: AuthCodes;
  text: string;
}

export interface WebSocketMessage {
  type: MessageType;
  data: AuthData | CodeData;
}
