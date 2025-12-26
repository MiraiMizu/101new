import React from 'react';
import { type Player } from '@101okey/shared';
import { User } from 'lucide-react';

interface PlayerSeatProps {
    player: Player;
    position: 'bottom' | 'top' | 'left' | 'right';
    isCurrentTurn: boolean;
}

export const PlayerSeat: React.FC<PlayerSeatProps> = ({ player, position, isCurrentTurn }) => {
    // Positioning styles based on "position"
    // Bottom: Main player, handled differently usually (Avatar hidden or small)
    // Top/Left/Right: Opponents

    const positionStyles = {
        bottom: 'bottom-4 left-8',
        top: 'top-4 left-1/2 -translate-x-1/2',
        left: 'left-4 top-1/2 -translate-y-1/2',
        right: 'right-4 top-1/2 -translate-y-1/2',
    };

    return (
        <div className={`absolute ${positionStyles[position]} flex flex-col items-center gap-2 transition-opacity duration-300 ${isCurrentTurn ? 'opacity-100' : 'opacity-70'}`}>
            <div className={`
                w-16 h-16 rounded-full bg-wood-dark border-4 flex items-center justify-center relative shadow-lg
                ${isCurrentTurn ? 'border-yellow-400 ring-4 ring-yellow-400/30' : 'border-gray-500'}
            `}>
                <User size={32} className="text-wood-light" />
                <div className="absolute -bottom-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded-full border border-wood-light whitespace-nowrap">
                    Score: {player.score}
                </div>
            </div>

            <div className="bg-black/50 px-3 py-1 rounded text-white font-bold text-sm backdrop-blur-sm">
                {player.name}
            </div>

            {/* Hand count indicator for opponents */}
            {position !== 'bottom' && (
                <div className="flex gap-1">
                    {Array.from({ length: Math.min(player.handCount, 10) }).map((_, i) => (
                        <div key={i} className="w-2 h-3 bg-wood-light rounded-[1px] opacity-80" />
                    ))}
                    {player.handCount > 10 && <span className="text-xs text-white">+{player.handCount - 10}</span>}
                </div>
            )}
        </div>
    );
};
