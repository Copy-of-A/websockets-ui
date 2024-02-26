export type RegData = {
  name: string;
  password: string;
};

export type AddUserToRoomData = {
  indexRoom: string;
};

export type AttackData = {
  gameId: string;
  x: number;
  y: number;
  indexPlayer: string /* id of the player in the current game session */;
};

export type AttackResData = {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: string /* id of the player in the current game session */;
  status: "miss" | "killed" | "shot";
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

export type Coordinate = {
  x: number;
  y: number;
};

export type ShipDTO = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
};

export type Ship = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
  shots: Array<Coordinate>;
};
