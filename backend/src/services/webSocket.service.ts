import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import {
  CodeData,
  MessageType,
  WebSocketMessage
} from '../models/webSocketMessage.interface';

export default class WebSocketService {
  private webSocketServer: WebSocketServer;
  private wsClients: WebSocket[] = [];

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

      this.wsClients.push(ws);

      // Handle the WebSocket `message` event. If any of the clients has a token
      // that is no longer valid, send an error message and close the client's
      // connection.
      ws.on('message', (data: string) => this.onMessage(ws, data));
    });
  }

  private onMessage(ws: WebSocket, data: string) {
    console.log('On Message');
    const message = JSON.parse(data) as WebSocketMessage;
    console.log(message);
    if (message) {
      switch (message.type) {
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

    this.wsClients
      .filter((wsClient) => wsClient !== ws)
      .forEach((wsClient) => {
        this.sendObj(wsClient, {
          type: MessageType.CODE,
          data
        });
      });
  }
}
