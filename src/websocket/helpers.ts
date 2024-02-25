import { EventType } from "./types";

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
