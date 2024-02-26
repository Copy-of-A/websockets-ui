import { EventType, ShipDTO } from "./types";

export const buildWSMessage = (type: EventType, data: unknown) =>
  JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0,
  });

export const parseWSMessage = (data: unknown) => {
  if (data === "") return "";
  try {
    return JSON.parse(String(data));
  } catch (error) {
    console.error(error);
  }
};

export const transformshipDTO = (ships: Array<ShipDTO>) => {
  return ships.map((ship) => ({
    x1: ship.position.x,
    y1: ship.position.y,
    x2: ship.direction ? ship.position.x : ship.position.x + ship.length - 1,
    y2: ship.direction ? ship.position.y + ship.length - 1 : ship.position.y,
    length: ship.length,
    shots: [],
  }));
};
