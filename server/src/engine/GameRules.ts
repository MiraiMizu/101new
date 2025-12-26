import { Tile } from './Tile';
import { TileColor } from '@101okey/shared';

export class GameRules {

    /**
     * Validates if a group of tiles is a valid Set (Same value, different colors)
     * or a valid Run (Same color, consecutive values).
     * 
     * NOTE: This does NOT yet handle 101 calculation or Joker substitutions perfectly.
     * Minimal implementation for structure.
     */
    static validateGroup(tiles: Tile[], okeyTile: Tile): boolean {
        if (tiles.length < 3) return false;

        // TODO: Handle Joker (Okey) logic substitution
        // For now, assume no jokers for basic check

        const first = tiles[0];
        const isSet = tiles.every(t => t.value === first.value);

        if (isSet) {
            // Must have different colors
            const colors = new Set(tiles.map(t => t.color));
            return colors.size === tiles.length;
        }

        // Check Run
        // All same color
        const isSameColor = tiles.every(t => t.color === first.color);
        if (!isSameColor) return false;

        // Consecutive
        // Need to sort first just in case? Usually input is expected to be sorted
        // But let's verify locally
        const sorted = [...tiles].sort((a, b) => a.value - b.value);

        // Check for 12-13-1 wrap
        // Special case: 1 can be after 13

        for (let i = 0; i < sorted.length - 1; i++) {
            const current = sorted[i];
            const next = sorted[i + 1];
            if (next.value !== current.value + 1) {
                // Check specific 13 -> 1 case
                if (current.value === 13 && next.value === 1) {
                    continue; // Valid wrap
                }
                return false;
            }
        }

        return true;
    }

    static calculatePoints(group: Tile[]): number {
        return group.reduce((sum, t) => sum + t.value, 0);
    }

    static isGroupValidWithOkey(group: Tile[], indicator: Tile): boolean {
        // Full implementation of Okey substitution logic needed here
        return true; // Placeholder
    }
}
