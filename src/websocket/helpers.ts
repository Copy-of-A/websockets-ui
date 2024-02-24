import { EventType } from "./types";

export const buildWSMessage = (type: EventType, data: unknown) =>
  JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0,
  });

export const parseWSMessage = (data: unknown) => JSON.parse(String(data));
