import { v4 as uuidv4 } from "uuid";

export class Player {
  name: string;
  password: string;
  id: string;

  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
    this.id = uuidv4();
  }
}
