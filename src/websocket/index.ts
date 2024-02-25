import { type WebSocket } from "ws";
import { EventMessage, RegData } from "./types";
import { PlayerService } from "./services/Player.service";
import { parseWSMessage, buildWSMessage } from "./helpers";
import { RoomService } from "./services/Room.service";
import { Player } from "./entities/Player";

const playerService = new PlayerService();
const roomService = new RoomService();

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
        roomService.addUserToRoom(responseData, currentPlayer);

        playerService.players.forEach((user) =>
          user.ws.send(
            buildWSMessage("update_room", roomService.getAvailableRooms())
          )
        );
        break;
    }
  };

  ws.onclose = () => {
    console.log("ws was closed");
  };
};
