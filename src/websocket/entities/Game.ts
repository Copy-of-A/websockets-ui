import { v4 as uuidv4 } from "uuid";
import { Ship } from "../types";
import { Player } from "./Player";

type PlayerInGame = {
  playerIndexInGame: string;
  player: Player;
  ships: Array<Ship>;
};

export class Game {
  id: string;
  players: Array<PlayerInGame>;

  constructor(playerFirst: Player, playerSecond: Player) {
    this.id = uuidv4();
    this.players = [];
    this.players[0] = {
      player: playerFirst,
      playerIndexInGame: uuidv4(),
      ships: [],
    };
    this.players[1] = {
      player: playerSecond,
      playerIndexInGame: uuidv4(),
      ships: [],
    };
  }
}
