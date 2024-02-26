import { Player } from "../entities/Player";
import { Room } from "../entities/Room";
import { buildWSMessage } from "../helpers";
import { AddUserToRoomData } from "../types";

export class RoomService {
  availableRooms: Array<Room>;

  constructor() {
    this.availableRooms = [];
  }

  createRoomWithUser(currentUser: Player) {
    const room = new Room();
    room.addPlayer(currentUser);
    this.availableRooms.push(room);
  }

  getAvailableRooms() {
    return this.availableRooms.map((room) => ({
      roomId: room.id,
      roomUsers: [
        {
          name: room.players[0]?.name,
          index: room.players[0]?.id,
        },
      ],
    }));
  }

  addUserToRoom(responseData: AddUserToRoomData, currentPlayer: Player) {
    const { indexRoom } = responseData;
    const roomIdx = this.availableRooms.findIndex(
      (room) => room.id === indexRoom
    );
    const currentRoom = this.availableRooms[roomIdx];

    if (currentRoom.players[0].id === currentPlayer.id) return;

    currentRoom.addPlayer(currentPlayer);

    return currentRoom;
  }

  removeRoomsWithPlayersBusyInCurrentRoom(currentRoom: Room) {
    const filtered = this.availableRooms.filter(
      (room) =>
        room.players[0].id !== currentRoom.players[0].id &&
        room.players[0].id !== currentRoom.players[1].id
    );
    this.availableRooms = filtered;
  }
}
