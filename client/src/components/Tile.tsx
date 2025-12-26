import React from 'react';
import { type Tile as ITile } from '@101okey/shared';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface TileProps {
    tile: ITile; // Or a simplified version if not full logic needed
    isJoker?: boolean;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
    drag?: boolean;
}

export const Tile: React.FC<TileProps> = ({ tile, isJoker, onClick, className, style, drag }) => {
    // Map colors to CSS classes
    const colorMap = {
        red: 'text-red-600',
        black: 'text-gray-900',
        blue: 'text-blue-600',
        yellow: 'text-yellow-500', // Yellow is tricky on white, use darker gold
    };

    // Fake Okey component logic if val is 0?
    const isFake = tile.value === 0;

    return (
        <motion.div
            layout
            drag={drag}
            dragConstraints={{ top: -50, left: -50, right: 50, bottom: 50 }} // Restrict movement initially or use constraint ref
            dragElastic={0.1}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            whileDrag={{ scale: 1.1, zIndex: 50, cursor: 'grabbing' }}
            className={clsx(
                "w-10 h-14 bg-[#f4e4bc] rounded shadow-tile flex flex-col items-center justify-center select-none cursor-grab relative border border-gray-300",
                className
            )}
            onClick={onClick}
            style={style}
        >
            <div className={clsx("font-bold text-2xl leading-none", colorMap[tile.color])}>
                {isFake ? '★' : tile.value}
            </div>
            {/* Small value for upsidedown view if needed, or visual flair */}
            {isJoker && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full m-1" title="Joker" />
            )}
        </motion.div>
    );
};
