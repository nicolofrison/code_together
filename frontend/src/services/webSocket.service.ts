import BaseAuthService from './baseAuth.service';
import {
  CodeData,
  MessageType,
  WebSocketMessage
} from '../models/interfaces/webSocketMessage.interface';

export default class WebSocketService extends BaseAuthService {
  private readonly WS_URL = `ws://${this.baseUrl.split('/')[2]}/ws`;

  private socket: WebSocket;

  private onCodeCallback: ((data: CodeData) => void) | undefined;

  private static instance: WebSocketService;
  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }

    return WebSocketService.instance;
  }

  public setOnCodeCallback(callback: (data: CodeData) => void) {
    this.onCodeCallback = callback;
  }

  private constructor() {
    super();

    this.socket = new WebSocket(this.WS_URL);

    this.socket.onmessage = this.onMessage.bind(this);
  }

  private sendJsonMessage = (data: object) => {
    this.socket.send(JSON.stringify(data));
  };

  private onMessage = (event: WebSocketEventMap['message']) => {
    console.log('On Message');
    const data = event.data;
    const message = JSON.parse(data) as WebSocketMessage;
    console.log(message);
    if (message) {
      switch (message.type) {
        case MessageType.CODE:
          // code incoming
          if (this.onCodeCallback) {
            this.onCodeCallback(message.data as CodeData);
          }
          break;
        default:
          // error
          console.error('message type error');
      }
    } else {
      // error
      console.error('message error');
    }
  };

  public sendCode = (data: CodeData) => {
    this.sendJsonMessage({
      type: MessageType.CODE,
      data
    });
  };
}
