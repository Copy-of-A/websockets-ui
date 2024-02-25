import { Game } from "../entities/Game";
import { Player } from "../entities/Player";
import { Ship } from "../types";

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

  addShipsForPlayer(game: Game, indexPlayer: string, ships: Array<Ship>) {
    const currentPlayer = game.players.find(
      (player) => player.playerIndexInGame === indexPlayer
    );
    if (!currentPlayer) return;

    currentPlayer.ships = ships;
  }
}
