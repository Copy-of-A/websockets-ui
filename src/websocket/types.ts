export type RegData = {
  name: string;
  password: string;
};

export type AddUserToRoomData = {
  indexRoom: string;
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

export type EventData = RegData | AddUserToRoomData;

export type EventMessage = {
  type: EventType;
  data: EventData;
  id: number;
};
