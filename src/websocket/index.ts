import { type WebSocket } from "ws";
import { type Player } from "./entities/Player";
import { EventMessage } from "./types";
import { parseWSMessage } from "./helpers";
import { PlayerService } from "./services/Player.service";
import { RoomService } from "./services/Room.service";
import { GameService } from "./services/Game.service";
import {
  addShipsHandler,
  addUserToRoomHandler,
  createRoomHandler,
  regHandler,
} from "./responseHandlers";

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
        regHandler(
          responseData,
          currentPlayer,
          {
            playerService,
            roomService,
            gameService,
          },
          ws
        );
        break;

      case "create_room":
        createRoomHandler(responseData, currentPlayer, {
          playerService,
          roomService,
          gameService,
        });
        break;

      case "add_user_to_room":
        addUserToRoomHandler(responseData, currentPlayer, {
          playerService,
          roomService,
          gameService,
        });
        break;

      case "add_ships":
        addShipsHandler(responseData, currentPlayer, {
          playerService,
          roomService,
          gameService,
        });
        break;
    }
  };

  ws.onclose = () => {
    console.log("ws was closed");
  };
};
