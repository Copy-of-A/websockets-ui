import { Game } from "../entities/Game";
import { Player } from "../entities/Player";
import { transformshipDTO } from "../helpers";
import { ShipDTO } from "../types";

export class GameService {
  games: Array<Game>;

  constructor() {
    this.games = [];
  }

  createGame(playerFirst: Player, playerSecond: Player) {
    const game = new Game(playerFirst, playerSecond);
    this.games.push(game);
    return game;
  }

  addShipsForPlayer(game: Game, indexPlayer: string, ships: Array<ShipDTO>) {
    const currentPlayer = game.players.find(
      (player) => player.playerIndexInGame === indexPlayer
    );
    if (!currentPlayer) return;

    currentPlayer.shipsDTO = ships;

    currentPlayer.ships = transformshipDTO(ships);
  }

  getOpponentFromGame(game: Game, indexPlayer: string) {
    return game.players.find(
      (player) => player.playerIndexInGame !== indexPlayer
    );
  }
}
