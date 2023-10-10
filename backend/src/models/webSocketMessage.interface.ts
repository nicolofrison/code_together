// If edited, update the same file in the frontend

export enum MessageType {
  CODE
}

export interface CodeData {
  text: string;
}

export interface WebSocketMessage {
  type: MessageType;
  data: CodeData;
}
