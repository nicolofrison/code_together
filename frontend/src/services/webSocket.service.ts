import BaseAuthService from './baseAuth.service';
import {
  AuthCodes,
  AuthData,
  CodeData,
  MessageType,
  WebSocketMessage
} from '../models/interfaces/webSocketMessage.interface';
import UserUtils from '../utils/UserUtils';

export default class WebSocketService extends BaseAuthService {
  private readonly WS_URL = `ws://${this.baseUrl.split('/')[2]}/ws`;

  private socket: WebSocket;

  private isWaitingLogging = false;
  private isLoggedIn = false;

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

  public removeOnCodeCallback() {
    this.onCodeCallback = undefined;
  }

  private constructor() {
    super();

    this.socket = new WebSocket(this.WS_URL);

    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
  }

  private sendJsonMessage = (data: object) => {
    this.socket.send(JSON.stringify(data));
  };

  private onOpen = (event: WebSocketEventMap['open']) => {
    console.log(event);

    if (!this.isWaitingLogging) {
      this.isWaitingLogging = true;

      const token = UserUtils.getInstance().getToken();
      if (token === null) {
        this.isWaitingLogging = false;
        console.log('no user logged in');
        return;
      }

      this.sendJsonMessage({
        type: MessageType.AUTH,
        data: {
          code: AuthCodes.REQUEST,
          text: token
        }
      } as WebSocketMessage);
    }
  };

  public sendCode = (data: CodeData) => {
    this.sendJsonMessage({
      type: MessageType.CODE,
      data
    });
  };

  private onMessage = (event: WebSocketEventMap['message']) => {
    console.log('On Message');
    const data = event.data;
    const message = JSON.parse(data) as WebSocketMessage;
    console.log(message);
    if (message) {
      switch (message.type) {
        case MessageType.AUTH:
          this.onAuth(message.data as AuthData);
          break;
        case MessageType.CODE:
          // code incoming
          this.onCodeInternal(message.data as CodeData);
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

  private onAuth = (data: AuthData) => {
    console.log('On Auth');
    console.log(this);

    if (data.code === AuthCodes.SUCCESS) {
      console.log('Auth successful');
      this.isLoggedIn = true;
    } else {
      console.error(data);
    }

    this.isWaitingLogging = false;
  };

  private onCodeInternal = (data: CodeData) => {
    if (this.onCodeCallback) {
      this.onCodeCallback(data);
    }
  };

  private onCodeCallbacks: ((data: CodeData) => void)[] = [];

  public addOnCodeCallback = (callback: (data: CodeData) => void) => {
    this.onCodeCallbacks.push(callback);
  };
}
