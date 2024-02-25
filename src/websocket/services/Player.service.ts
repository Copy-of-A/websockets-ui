import { Player } from "../entities/Player";
import { type WebSocket } from "ws";

export class PlayerService {
  players: Array<Player>;

  constructor() {
    this.players = [];
  }

  checkPlayerExist(username: string) {
    return this.players.find((player) => player.name === username);
  }

  createPlayer(ws: WebSocket, name: string, password: string) {
    const player = new Player(ws, name, password);
    this.players.push(player);
    return player;
  }
}
