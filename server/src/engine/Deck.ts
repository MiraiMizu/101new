import { Tile } from './Tile';
import { TileColor } from '@101okey/shared';

export class Deck {
    tiles: Tile[] = [];

    constructor() {
        this.initialize();
    }

    initialize() {
        this.tiles = [];
        let idCounter = 1;
        const colors: TileColor[] = ['red', 'black', 'blue', 'yellow'];

        // 2 sets of 1-13 for each color
        for (const color of colors) {
            for (let i = 0; i < 2; i++) {
                for (let value = 1; value <= 13; value++) {
                    this.tiles.push(new Tile(`tile-${idCounter++}`, value, color));
                }
            }
        }

        // 2 Fake Okeys
        // We'll represent Fake Okeys with a special value, e.g., 0, and maybe a null color or black?
        // Let's give them a distinct immutable identity.
        this.tiles.push(new Tile(`tile-${idCounter++}`, 0, 'black')); // Fake Okey 1
        this.tiles.push(new Tile(`tile-${idCounter++}`, 0, 'black')); // Fake Okey 2
    }

    shuffle() {
        for (let i = this.tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
        }
    }

    draw(): Tile | undefined {
        return this.tiles.pop();
    }

    /**
     * Determines the 'Okey' (Joker) for the game based on the indicator.
     * The indicator is the last tile drawn or manually picked.
     * Okey is the same color, value + 1. (13 -> 1)
     */
    determineOkey(indicator: Tile): Tile {
        // If indicator is Fake Okey (unlikely start but possible if popped?), rule check needed. 
        // Usually indicator is just a regular tile.

        let nextValue = indicator.value + 1;
        if (nextValue > 13) nextValue = 1;

        // We return a "prototype" of the Okey tile.
        // Any tile matching this color & value is the Okey.
        return new Tile('okey-proto', nextValue, indicator.color);
    }
}
