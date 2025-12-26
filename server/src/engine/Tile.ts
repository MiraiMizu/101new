import { Tile as ITile, TileColor } from '@101okey/shared';

export class Tile implements ITile {
    id: string;
    value: number;
    color: TileColor;

    // These properties depend on the current game state (indicator)
    // so they might be calculated, but for serialization we store them?
    // Actually, it's better to compute "isOkey" dynamically or set it when the game starts.
    // For the server object, we'll store the raw identity.

    constructor(id: string, value: number, color: TileColor) {
        this.id = id;
        this.value = value;
        this.color = color;
    }

    // Helper to check if this is a "Fake Okey" tile (the one with the symbol)
    // In our representation, we can say value 14 is the fake okey? 
    // Standard sets usually have 1-13. The fake okey is special.
    // Let's use a specific convention.
    // We will assume "Fake Okey" has value 0 or special property.

    static create(id: string, value: number, color: TileColor): Tile {
        return new Tile(id, value, color);
    }
}
