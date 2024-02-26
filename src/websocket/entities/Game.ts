import { v4 as uuidv4 } from "uuid";
import { Coordinate, Ship, ShipDTO } from "../types";
import { Player } from "./Player";

export type PlayerInGame = {
  playerIndexInGame: string;
  player: Player;
  ships: Array<Ship>;
  shipsDTO: Array<ShipDTO>;
  attackedFields: Array<Coordinate>;
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
      shipsDTO: [],
      ships: [],
      attackedFields: [],
    };
    this.players[1] = {
      player: playerSecond,
      playerIndexInGame: uuidv4(),
      shipsDTO: [],
      ships: [],
      attackedFields: [],
    };
  }

  attack(player: PlayerInGame, x: number, y: number) {
    if (
      player.attackedFields.find((attack) => attack.x === x && attack.y === y)
    ) {
      return;
    }
    player.attackedFields.push({ x, y });

    const shottedShip = player.ships.find(
      (ship) => x >= ship.x1 && x <= ship.x2 && y >= ship.y1 && y <= ship.y2
    );

    if (
      shottedShip &&
      !shottedShip.shots.find((shot) => shot.x === x && shot.y === y)
    ) {
      shottedShip.shots.push({
        x,
        y,
      });

      if (shottedShip.shots.length === shottedShip.length) {
        return { status: "killed", ship: shottedShip } as const;
      } else {
        return { status: "shot", ship: shottedShip } as const;
      }
    } else {
      return { status: "miss", ship: null } as const;
    }
  }

  getPositionsStatusesForKilledShip(player: PlayerInGame, shottedShip: Ship) {
    const missedPositions = [];
    for (let x = shottedShip.x1 - 1; x <= shottedShip.x2 + 1; x++) {
      for (let y = shottedShip.y1 - 1; y <= shottedShip.y2 + 1; y++) {
        if (x < 0 || x > 9 || y < 0 || y > 9) {
          continue;
        }
        const isShip =
          x >= shottedShip.x1 &&
          x <= shottedShip.x2 &&
          y >= shottedShip.y1 &&
          y <= shottedShip.y2;

        missedPositions.push({
          position: { x, y },
          status: isShip ? "killed" : "miss",
        });

        if (!isShip) {
          player.attackedFields.push({ x, y });
        }
      }
    }

    return missedPositions;
  }

  checkAllShipsKilled(player: PlayerInGame) {
    return player.ships.every((ship) => ship.shots.length === ship.length);
  }
}
