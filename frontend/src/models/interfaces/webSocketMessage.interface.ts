// If edited, update the same file in the backend

export enum MessageType {
  AUTH,
  CODE,
  CHAT
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

export interface ChatData {
  from: string;
  message: string;
}

export interface WebSocketMessage {
  type: MessageType;
  data: AuthData | CodeData | ChatData;
}
