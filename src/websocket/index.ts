import { type WebSocket } from "ws";
import { EventMessage, RegData } from "./types";
import { PlayerService } from "./services/Player.service";
import { parseWSMessage, buildWSMessage } from "./helpers";
import { RoomService } from "./services/Room.service";
import { type Player } from "./entities/Player";
import { GameService } from "./services/Game.service";

const playerService = new PlayerService();
const roomService = new RoomService();
const gameService = new GameService();

export const connectionHandler = (ws: WebSocket) => {
  let currentPlayer: Player;
  ws.onmessage = (event) => {
    const message = parseWSMessage(event.data) as EventMessage;
    const responseType = message.type;
    const responseData = parseWSMessage(message.data);

    switch (responseType) {
      case "reg":
        const { name, password } = responseData as RegData;
        if (playerService.checkPlayerExist(name)) {
          playerService.sendUserNameError(ws, name);
        } else {
          currentPlayer = playerService.createPlayer(ws, name, password);
          playerService.regUser(currentPlayer);

          if (roomService.availableRooms.length < 1) return;
          playerService.players.forEach((user) =>
            user.ws.send(
              buildWSMessage("update_room", roomService.getAvailableRooms())
            )
          );
        }
        break;

      case "create_room":
        roomService.createRoomWithUser(currentPlayer);

        if (roomService.availableRooms.length < 1) return;
        playerService.players.forEach((user) =>
          user.ws.send(
            buildWSMessage("update_room", roomService.getAvailableRooms())
          )
        );
        break;

      case "add_user_to_room":
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
          user.ws.send(
            buildWSMessage("update_room", roomService.getAvailableRooms())
          )
        );
        break;

      case "add_ships":
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
        break;
    }
  };

  ws.onclose = () => {
    console.log("ws was closed");
  };
};
