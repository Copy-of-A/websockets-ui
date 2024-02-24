import { Player } from "../entities/Player";
import { buildWSMessage } from "../helpers";
import { RegData } from "../types";
import { type WebSocket } from "ws";

export class PlayerService {
  players: Array<Player>;
  currentPlayer?: Player;

  constructor() {
    this.players = [];
  }

  regUser(ws: WebSocket, responseData: RegData) {
    const { name, password } = responseData;
    if (this.#ifPlayerExist(name)) {
      ws.send(
        buildWSMessage("reg", {
          name: name,
          index: "",
          error: true,
          errorText: "User with this name has already been logged in",
        })
      );
      return true;
    } else {
      this.currentPlayer = this.#createPlayer(name, password);
      this.players.push(this.currentPlayer);
      ws.send(
        buildWSMessage("reg", {
          name: this.currentPlayer.name,
          index: this.currentPlayer.id,
          error: false,
          errorText: "",
        })
      );
      return false;
    }
  }

  #ifPlayerExist(username: string) {
    return this.players.find((player) => player.name === username);
  }

  #createPlayer(name: string, password: string) {
    return new Player(name, password);
  }
}
