import { v4 as uuidv4 } from "uuid";
import { type WebSocket } from "ws";

export class Player {
  ws: WebSocket;
  name: string;
  password: string;
  id: string;
  wins: number;

  constructor(ws: WebSocket, name: string, password: string) {
    this.ws = ws;
    this.name = name;
    this.password = password;
    this.id = uuidv4();
    this.wins = 0;
  }
}
