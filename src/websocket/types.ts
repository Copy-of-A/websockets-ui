export type RegData = {
  name: string;
  password: string;
};

type AddUserToRoomData = {
  indexRoom: number;
};

export type EventType =
  | "reg"
  | "create_room"
  | "add_user_to_room"
  | "create_game"
  | "start_game"
  | "turn"
  | "attack"
  | "finish"
  | "update_room"
  | "update_winners";

type EventData = RegData | AddUserToRoomData;

export type EventMessage = {
  type: EventType;
  data: EventData;
  id: number;
};
