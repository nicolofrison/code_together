import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import {
  AuthCodes,
  AuthData,
  CodeData,
  MessageType,
  WebSocketMessage
} from '../models/webSocketMessage.interface';

import { jwtService } from './jwt.service';
import {
  AuthenticationHttpError,
  AuthenticationHttpErrorType
} from '../models/http/errors/AuthenticationHttpError';

export default class WebSocketService {
  private webSocketServer: WebSocketServer;
  private wsClients: { [token: string]: WebSocket } = {};

  private static instance: WebSocketService;
  public static getInstance(server?: Server): WebSocketService | null {
    if (!this.instance && server) {
      this.instance = new WebSocketService(server);
    }

    return this.instance;
  }

  private constructor(server: Server) {
    this.webSocketServer = new WebSocketServer({
      server: server,
      path: '/ws'
    });
  }

  sendObj(ws: WebSocket, data: object) {
    const jsonString = JSON.stringify(data);

    ws.send(jsonString);
  }

  init() {
    this.webSocketServer.on('connection', (ws) => {
      console.log('On Connection');

      // Handle the WebSocket `message` event. If any of the clients has a token
      // that is no longer valid, send an error message and close the client's
      // connection.
      ws.on('message', (data: string) => this.onMessage(ws, data));
    });
  }

  public isWsCodeUsed(wsCode: string) {
    return Object.values(this.wsClients).some((ws) => ws.protocol === wsCode);
  }

  private onMessage(ws: WebSocket, data: string) {
    console.log('On Message');
    const message = JSON.parse(data) as WebSocketMessage;
    console.log(message);
    if (message) {
      switch (message.type) {
        case MessageType.AUTH:
          this.authenticateUser(ws, message.data as AuthData);
          break;
        case MessageType.CODE:
          this.sendCode(ws, message.data as CodeData);
          break;
        default:
          // error
          console.error('message type error');
          console.error(message);
      }
    } else {
      // error
      console.error('empty message error');
    }
  }

  private sendCode(ws: WebSocket, data: CodeData) {
    console.log('On Code');
    if (!Object.values(this.wsClients).includes(ws)) {
      // error
      console.error('not authenticated error');
    }

    Object.values(this.wsClients)
      .filter(
        (wsClient) => wsClient !== ws && wsClient.protocol === ws.protocol
      )
      .forEach((wsClient) => {
        this.sendObj(wsClient, {
          type: MessageType.CODE,
          data
        });
      });
  }

  private authenticateUser(ws: WebSocket, data: AuthData) {
    console.log('On Auth');
    const token = data.text;

    let response: AuthData;

    jwtService
      .authenticate(token)
      .then(() => {
        console.log('WS Connection succeded');
        this.wsClients[token] = ws;

        this.sendObj(ws, {
          type: MessageType.AUTH,
          data: {
            code: AuthCodes.SUCCESS,
            text: 'Websocket login successful'
          }
        });
      })
      .catch((e) => {
        if (e instanceof AuthenticationHttpError) {
          switch ((e as AuthenticationHttpError).type) {
            case AuthenticationHttpErrorType.ExpiredAuthenticationToken:
              response = {
                code: AuthCodes.TOKEN_EXPIRED,
                text: ''
              };
              break;
            default:
              response = {
                code: AuthCodes.TOKEN_ERROR,
                text: 'The token is either missing or wrong'
              };
              break;
          }
        } else {
          response = {
            code: AuthCodes.TOKEN_ERROR,
            text: 'Internal error'
          };
        }
        this.sendObj(ws, {
          type: MessageType.AUTH,
          data: response
        });
        ws.close();
      });
  }
}
