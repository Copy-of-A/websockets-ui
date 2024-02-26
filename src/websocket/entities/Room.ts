import { Player } from "./Player";
import { v4 as uuidv4 } from "uuid";

export class Room {
  players: Array<Player>;
  id: string;

  constructor() {
    this.players = [];
    this.id = uuidv4();
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }
}
