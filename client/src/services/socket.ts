import { io, Socket } from 'socket.io-client';
import { EVENTS } from '@101okey/shared'; // We need to make sure vite can resolve this

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class SocketService {
    public socket: Socket | null = null;

    connect() {
        if (!this.socket) {
            this.socket = io(SOCKET_URL);
            this.socket.on('connect', () => {
                console.log('Connected to server', this.socket?.id);
            });
        }
        return this.socket;
    }

    createRoom(playerName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.socket?.emit(EVENTS.CREATE_ROOM, { playerName }, (response: any) => {
                if (response.success) resolve(response);
                else reject(response.error);
            });
        });
    }

    joinRoom(roomId: string, playerName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.socket?.emit(EVENTS.JOIN_ROOM, { roomId, playerName }, (response: any) => {
                if (response.success) resolve(response);
                else reject(response.error);
            });
        });
    }
}

export const socketService = new SocketService();
