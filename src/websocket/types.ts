type RegData = {
  name: string;
  password: string;
};

type EventType =
  | "reg"
  | "create_game"
  | "start_game"
  | "turn"
  | "attack"
  | "finish"
  | "update_room"
  | "update_winners";

type EventData = RegData;

export type EventMessage = {
  type: EventType;
  data: EventData;
  id: number;
};
