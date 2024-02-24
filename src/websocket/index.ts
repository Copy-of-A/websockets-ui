import { type WebSocket } from "ws";
import { EventMessage } from "./types";
import { PlayerService } from "./services/Player.service";
import { parseWSMessage } from "./helpers";

const playerService = new PlayerService();

export const connectionHandler = (ws: WebSocket) => {
  ws.onmessage = (event) => {
    const message = parseWSMessage(event.data) as EventMessage;
    const responseType = message.type;
    const responseData = parseWSMessage(message.data);

    switch (responseType) {
      case "reg":
        playerService.regUser(ws, responseData);
        break;
    }
  };

  ws.onclose = () => {
    console.log("ws was closed");
  };
};
