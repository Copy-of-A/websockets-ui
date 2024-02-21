import { type WebSocket } from "ws";
import { Player } from "./Player";
import { EventMessage } from "./types";
import { buildWSMessage } from "./helpers";

export const connectionHandler = (ws: WebSocket) => {
  let player: Player;

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data.toString()) as EventMessage;
    const responseType = message.type;
    const responseData = message.data;

    switch (responseType) {
      case "reg":
        player = new Player(responseData.name, responseData.password);
        ws.send(
          buildWSMessage("reg", {
            name: player.name,
            index: player.id,
            error: false,
            errorText: "",
          })
        );
        break;
    }
  };

  ws.onclose = () => {
    console.log("ws was closed");
  };
};
