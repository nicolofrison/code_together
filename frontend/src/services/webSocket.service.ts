import {
  AuthCodes,
  AuthData,
  ChatData,
  CodeData,
  MessageType,
  WebSocketMessage
} from '../models/interfaces/webSocketMessage.interface';

import UserUtils from '../utils/UserUtils';

import BaseAuthService from './baseAuth.service';

export default class WebSocketService extends BaseAuthService {
  private readonly WS_URL = `ws://${this.baseUrl.split('/')[2]}/ws`;

  private socket?: WebSocket;

  // the connection id, shared with the users that share the same code
  private protocol?: string;

  private isWaitingLogging = false;

  // #region OnOpenCallbacks
  private onConnectedCallbacks: ((isConnected: boolean) => void)[] = [];
  public addOnConnectedCallback(callback: (isConnected: boolean) => void) {
    this.onConnectedCallbacks.push(callback);
  }

  public clearOnConnectedCallbacks() {
    this.onConnectedCallbacks = [];
  }
  // #endregion

  // #region OnCodeCallback
  private onCodeCallback: ((data: CodeData) => void) | undefined;
  public setOnCodeCallback(callback: (data: CodeData) => void) {
    this.onCodeCallback = callback;
  }

  public removeOnCodeCallback() {
    this.onCodeCallback = undefined;
  }
  // #endregion

  // #region OnChatCallback
  private onChatCallback: ((data: ChatData) => void) | undefined;
  public setOnChatCallback(callback: (data: ChatData) => void) {
    this.onChatCallback = callback;
  }

  public removeOnChatCallback() {
    this.onChatCallback = undefined;
  }
  // #endregion

  private static instance: WebSocketService;
  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }

    return WebSocketService.instance;
  }

  private constructor() {
    super();
  }

  public connectSocket = (protocol: string) => {
    if (this.socket) {
      this.socket.close();
    }

    if (protocol) {
      this.protocol = protocol;
      this.socket = new WebSocket(this.WS_URL, protocol);
    } else {
      this.socket = new WebSocket(this.WS_URL);
    }

    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onclose = this.onClose.bind(this);
  };

  public closeSocket() {
    this.socket?.close();
  }

  private sendJsonMessage = (data: object) => {
    this.socket?.send(JSON.stringify(data));
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

  public sendMessage = (data: ChatData) => {
    this.sendJsonMessage({
      type: MessageType.CHAT,
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
        case MessageType.CHAT:
          // code incoming
          this.onMessageInternal(message.data as ChatData);
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

  private onClose = () => {
    //
  };

  private onAuth = (data: AuthData) => {
    console.log('On Auth');
    console.log(this);

    if (data.code === AuthCodes.SUCCESS) {
      console.log('Auth successful');
      this.onConnectedCallbacks.forEach((c) => c(true));
    } else {
      console.error(data);
      if (data.code === AuthCodes.TOKEN_EXPIRED) {
        UserUtils.getInstance().removeUser();
      }
    }

    this.isWaitingLogging = false;
  };

  private onCodeInternal = (data: CodeData) => {
    if (this.onCodeCallback) {
      this.onCodeCallback(data);
    }
  };

  private onMessageInternal = (data: ChatData) => {
    if (this.onChatCallback) {
      this.onChatCallback(data);
    }
  };
}
