import { Player } from "../entities/Player";
import { buildWSMessage } from "../helpers";
import { type WebSocket } from "ws";

export class PlayerService {
  players: Array<Player>;

  constructor() {
    this.players = [];
  }

  sendUserNameError(ws: WebSocket, name: string) {
    ws.send(
      buildWSMessage("reg", {
        name: name,
        index: "",
        error: true,
        errorText: "User with this name has already been logged in",
      })
    );
  }

  regUser(user: Player) {
    user.ws.send(
      buildWSMessage("reg", {
        name: user.name,
        index: user.id,
        error: false,
        errorText: "",
      })
    );
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
