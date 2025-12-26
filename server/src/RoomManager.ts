import { Game } from './engine/Game';
import { Player } from './engine/Player';

export class RoomManager {
    rooms: Map<string, Game> = new Map();

    createRoom(): string {
        const roomId = this.generateRoomId();
        const game = new Game(roomId);
        this.rooms.set(roomId, game);
        return roomId;
    }

    getRoom(roomId: string): Game | undefined {
        return this.rooms.get(roomId);
    }

    joinRoom(roomId: string, player: Player): Game {
        const room = this.rooms.get(roomId);
        if (!room) throw new Error('Room not found');
        room.addPlayer(player);
        return room;
    }

    removePlayer(roomId: string, playerId: string) {
        const room = this.rooms.get(roomId);
        if (!room) return;

        // Logic to handle player leave. 
        // If empty, delete room.
        const idx = room.players.findIndex(p => p.id === playerId);
        if (idx !== -1) {
            room.players.splice(idx, 1);
        }

        if (room.players.length === 0) {
            this.rooms.delete(roomId);
        }
    }

    private generateRoomId(): string {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        // ensure unique
        if (this.rooms.has(result)) return this.generateRoomId();
        return result;
    }
}
