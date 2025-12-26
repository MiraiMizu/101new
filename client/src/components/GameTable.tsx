import React, { useEffect, useState } from 'react';
import { type GameState, type Player, EVENTS } from '@101okey/shared';
import { PlayerSeat } from './PlayerSeat';
import { Tile } from './Tile';
import { socketService } from '../services/socket';

interface GameTableProps {
    initialState: GameState;
    myId: string; // The ID of the current player (socket.id)
}

export const GameTable: React.FC<GameTableProps> = ({ initialState, myId }) => {
    const [gameState, setGameState] = useState<GameState>(initialState);

    useEffect(() => {
        const socket = socketService.connect();

        socket?.on(EVENTS.ROOM_UPDATE, (state: GameState) => {
            console.log('Update:', state);
            setGameState(state);
        });

        socket?.on(EVENTS.GAME_START, (state: GameState) => {
            setGameState(state);
        });

        return () => {
            socket?.off(EVENTS.ROOM_UPDATE);
            socket?.off(EVENTS.GAME_START);
        };
    }, []);

    // Helper to find seat position relative to "me"
    // My seat is always 'bottom'
    // Next is 'right', then 'top', then 'left' (counter-clockwise or clockwise?)
    // Standard: Anti-clockwise turn? or Clockwise?
    // Let's assume Clockwise turns: Me -> Right -> Top -> Left

    const getRelativePosition = (player: Player): 'bottom' | 'top' | 'left' | 'right' => {
        if (player.id === myId) return 'bottom';

        // Find my seat index
        // If I am not in players (spectator?), default to bottom view or handling
        // ...

        // Simple mapping for now
        // TODO: Proper rotation logic
        return 'top';
    };

    const handleStart = () => {
        socketService.socket?.emit(EVENTS.GAME_START, { roomId: gameState.roomId });
    };

    return (
        <div className="relative w-full h-full bg-felt-green overflow-hidden select-none">
            {/* Table Surface Texture/Gradient */}
            <div className="absolute inset-0 bg-radial-gradient from-felt-green to-felt-dark pointer-events-none" />

            {/* Center Area */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 border-4 border-white/10 rounded-3xl flex items-center justify-center">
                {/* Deck & Discards */}
                <div className="flex gap-8">
                    {/* Draw Pile */}
                    <div className="w-24 h-32 bg-wood-dark rounded shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                        <span className="text-wood-light font-bold text-xl">{gameState.centerPileCount}</span>
                    </div>

                    {/* Indicator */}
                    {gameState.indicator && (
                        <div className="relative">
                            <Tile tile={gameState.indicator} className="opacity-90" />
                            <div className="absolute -bottom-6 w-full text-center text-white text-xs font-bold uppercase tracking-widest">
                                Indicator
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Players */}
            {gameState.players.map(p => (
                <PlayerSeat
                    key={p.id}
                    player={p}
                    position={getRelativePosition(p)}
                    isCurrentTurn={gameState.players.findIndex(pl => pl.id === p.id) === gameState.currentTurnParams.seatIndex}
                />
            ))}

            {/* Host Controls */}
            {gameState.status === 'waiting' && gameState.players.find(p => p.id === myId)?.isHost && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-24">
                    <button
                        onClick={handleStart}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded shadow-lg animate-pulse"
                    >
                        START GAME
                    </button>
                </div>
            )}

            {/* My Hand (The Rack) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-32 bg-wood-dark border-t-8 border-wood-light shadow-2xl rounded-t-lg flex items-end justify-center pb-2 px-4 gap-1 overflow-x-auto">
                {/* This should be real tiles from my private view, but gameState.players only has public info? 
                     I need to update GameState to include MY hand, or fetch it separately.
                     For now, assume gameState sends my hand if I am the requestor (server logic TODO)
                  */}
                <span className="text-white/20 self-center">Your Rack (Tiles will appear here)</span>
            </div>
        </div>
    );
};
