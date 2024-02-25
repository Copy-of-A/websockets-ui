export type RegData = {
  name: string;
  password: string;
};

export type AddUserToRoomData = {
  indexRoom: string;
};

export type AddShipsData = {
  gameId: string;
  ships: [
    {
      position: {
        x: number;
        y: number;
      };
      direction: boolean;
      length: number;
      type: "small" | "medium" | "large" | "huge";
    }
  ];
  indexPlayer: string /* id of the player in the current game session */;
};

export type EventType =
  | "reg"
  | "create_room"
  | "add_user_to_room"
  | "add_ships"
  | "create_game"
  | "start_game"
  | "turn"
  | "attack"
  | "finish"
  | "update_room"
  | "update_winners";

export type EventData = RegData | AddUserToRoomData;

export type EventMessage = {
  type: EventType;
  data: EventData;
  id: number;
};

export type Ship = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
};
