import { Player } from "./entities/Player";
import { GameService } from "./services/Game.service";
import { PlayerService } from "./services/Player.service";
import { RoomService } from "./services/Room.service";
import { AddShipsData, AddUserToRoomData, RegData } from "./types";
import { buildWSMessage } from "./helpers";
import { WebSocket } from "ws";

type Services = {
  playerService: PlayerService;
  roomService: RoomService;
  gameService: GameService;
};

export const regHandler = (
  responseData: RegData,
  currentPlayer: Player,
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
    currentPlayer = playerService.createPlayer(ws, name, password);
    currentPlayer.ws.send(
      buildWSMessage("reg", {
        name: currentPlayer.name,
        index: currentPlayer.id,
        error: false,
        errorText: "",
      })
    );

    if (roomService.availableRooms.length < 1) return;
    playerService.players.forEach((user) =>
      user.ws.send(
        buildWSMessage("update_room", roomService.getAvailableRooms())
      )
    );
  }
};

export const createRoomHandler = (
  _: unknown,
  currentPlayer: Player,
  services: Services
) => {
  const { playerService, roomService } = services;
  roomService.createRoomWithUser(currentPlayer);

  if (roomService.availableRooms.length < 1) return;
  playerService.players.forEach((user) =>
    user.ws.send(buildWSMessage("update_room", roomService.getAvailableRooms()))
  );
};

export const addUserToRoomHandler = (
  responseData: AddUserToRoomData,
  currentPlayer: Player,
  services: Services
) => {
  const { playerService, roomService, gameService } = services;
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

  playerService.players.forEach((user) =>
    user.ws.send(buildWSMessage("update_room", roomService.getAvailableRooms()))
  );
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
          ships: gamePlayer.ships,
          currentPlayerIndex: gamePlayer.playerIndexInGame,
        })
      );
    });
  }
};
