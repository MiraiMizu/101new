import { Server, Socket } from 'socket.io';
import { RoomManager } from './RoomManager';
import { Player } from './engine/Player';
import { EVENTS } from '@101okey/shared';

export function setupSocketHandlers(io: Server, roomManager: RoomManager) {
    io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id);

        // Create Room
        socket.on(EVENTS.CREATE_ROOM, (data: { playerName: string }, callback) => {
            try {
                const roomId = roomManager.createRoom();
                const player = new Player(socket.id, data.playerName, 0, true); // Host
                const game = roomManager.joinRoom(roomId, player);

                socket.join(roomId);
                callback({ success: true, roomId, state: game.getState() });
            } catch (e: any) {
                callback({ success: false, error: e.message });
            }
        });

        // Join Room
        socket.on(EVENTS.JOIN_ROOM, (data: { roomId: string, playerName: string }, callback) => {
            try {
                const { roomId, playerName } = data;
                const room = roomManager.getRoom(roomId);
                if (!room) throw new Error('Room not found');

                // Find next empty seat (0-3)
                // Simple assignment:
                const seatIndex = room.players.length;

                const player = new Player(socket.id, playerName, seatIndex, false);
                const game = roomManager.joinRoom(roomId, player);

                socket.join(roomId);

                // Broadcast to others
                socket.to(roomId).emit(EVENTS.ROOM_UPDATE, game.getState());

                callback({ success: true, roomId, state: game.getState() });
            } catch (e: any) {
                callback({ success: false, error: e.message });
            }
        });

        // Start Game
        socket.on(EVENTS.GAME_START, (data: { roomId: string }) => {
            try {
                const game = roomManager.getRoom(data.roomId);
                if (!game) return;
                // Validate host?
                const player = game.players.find(p => p.id === socket.id);
                if (!player?.isHost) return;

                game.start();
                io.to(data.roomId).emit(EVENTS.GAME_START, game.getState());
            } catch (e) {
                console.error(e);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            // Handle disconnect
        });
    });
}
