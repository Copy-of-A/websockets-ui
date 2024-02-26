import { Player } from "../entities/Player";
import { type WebSocket } from "ws";
import { buildWSMessage } from "../helpers";

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

  updateWinnersForAllPlayers() {
    const winners = this.players.map((player) => ({
      name: player.name,
      wins: player.wins,
    }));
    this.players.forEach((player) => {
      player.ws.send(buildWSMessage("update_winners", winners));
    });
  }
}
