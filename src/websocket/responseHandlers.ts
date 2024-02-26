import { Player } from "./entities/Player";
import { GameService } from "./services/Game.service";
import { PlayerService } from "./services/Player.service";
import { RoomService } from "./services/Room.service";
import { AddShipsData, AddUserToRoomData, AttackData, RegData } from "./types";
import { buildWSMessage } from "./helpers";
import { WebSocket } from "ws";

type Services = {
  playerService: PlayerService;
  roomService: RoomService;
  gameService: GameService;
};

export const regHandler = (
  responseData: RegData,
  _: unknown,
  services: Services,
  ws: WebSocket
) => {
  const { name, password } = responseData;
  const { playerService, roomService } = services;

  if (playerService.checkPlayerExist(name)) {
    ws.send(
      buildWSMessage("reg", {
        name: name,
        index: "",
        error: true,
        errorText: "User with this name has already been logged in",
      })
    );
  } else {
    const currentPlayer = playerService.createPlayer(ws, name, password);
    currentPlayer.ws.send(
      buildWSMessage("reg", {
        name: currentPlayer.name,
        index: currentPlayer.id,
        error: false,
        errorText: "",
      })
    );

    return currentPlayer;
  }
};

export const updateRoomHandeler = (services: Services) => {
  const { playerService, roomService } = services;

  playerService.players.forEach((user) =>
    user.ws.send(buildWSMessage("update_room", roomService.getAvailableRooms()))
  );
};

export const createRoomHandler = (
  _: unknown,
  currentPlayer: Player,
  services: Services
) => {
  const { roomService } = services;
  roomService.createRoomWithUser(currentPlayer);
};

export const addUserToRoomHandler = (
  responseData: AddUserToRoomData,
  currentPlayer: Player,
  services: Services
) => {
  const { roomService, gameService } = services;
  const room = roomService.addUserToRoom(responseData, currentPlayer);

  if (room) {
    const game = gameService.createGame(room.players[0], room.players[1]);
    room.players.forEach((player, index) => {
      player.ws.send(
        buildWSMessage("create_game", {
          idGame: game.id,
          idPlayer: game.players[index].playerIndexInGame,
        })
      );
    });
    roomService.removeRoomsWithPlayersBusyInCurrentRoom(room);
  }
};

export const addShipsHandler = (
  responseData: AddShipsData,
  _: unknown,
  services: Services
) => {
  const { gameService } = services;
  const { gameId, ships, indexPlayer } = responseData;

  const currentGame = gameService.games.find((game) => game.id == gameId);
  if (!currentGame) return;

  gameService.addShipsForPlayer(currentGame, indexPlayer, ships);

  const opponent = currentGame.players.find(
    (user) => user.playerIndexInGame !== indexPlayer
  );

  if (opponent && opponent.ships.length > 0) {
    currentGame.players.forEach((gamePlayer) => {
      gamePlayer.player.ws.send(
        buildWSMessage("start_game", {
          ships: gamePlayer.shipsDTO,
          currentPlayerIndex: gamePlayer.playerIndexInGame,
        })
      );
      gamePlayer.player.ws.send(
        buildWSMessage("turn", {
          currentPlayer: indexPlayer,
        })
      );
    });
  }
};

export const attackHandler = (
  responseData: AttackData,
  currentPlayer: Player,
  services: Services
) => {
  const { playerService, gameService } = services;
  const { gameId, x, y, indexPlayer } = responseData;

  const currentGame = gameService.games.find((game) => game.id === gameId);
  if (!currentGame) return;

  const opponent = gameService.getOpponentFromGame(currentGame, indexPlayer);
  if (!opponent) return;

  const shotResult = currentGame.attack(opponent, x, y);

  if (!shotResult) return;

  if (shotResult.status === "killed") {
    const positionsStatusesForKilledShip =
      currentGame.getPositionsStatusesForKilledShip(opponent, shotResult.ship);

    positionsStatusesForKilledShip.forEach((data) => {
      currentGame.players.forEach((playerInGame) =>
        playerInGame.player.ws.send(
          buildWSMessage("attack", {
            ...data,
            currentPlayer: indexPlayer,
          })
        )
      );
    });
  } else {
    currentGame.players.forEach((playerInGame) =>
      playerInGame.player.ws.send(
        buildWSMessage("attack", {
          position: {
            x,
            y,
          },
          currentPlayer: indexPlayer,
          status: shotResult.status,
        })
      )
    );
  }

  if (["killed", "miss"].includes(shotResult.status)) {
    currentGame.players.forEach((playerInGame) =>
      playerInGame.player.ws.send(
        buildWSMessage("turn", {
          currentPlayer: opponent.playerIndexInGame,
        })
      )
    );
  }

  if (currentGame.checkAllShipsKilled(opponent)) {
    currentPlayer.wins++;
    currentGame.players.forEach((playerInGame) =>
      playerInGame.player.ws.send(
        buildWSMessage("finish", {
          winPlayer: indexPlayer,
        })
      )
    );
    playerService.updateWinnersForAllPlayers();
  }
};
