import { Tile } from './Tile';
import { Player as IPlayer } from '@101okey/shared';

export class Player implements IPlayer {
    id: string;
    name: string;
    avatar?: string;
    isHost: boolean;
    score: number = 0;
    seatIndex: number;
    isBot: boolean;
    isConnected: boolean = true;

    hand: Tile[] = [];

    constructor(id: string, name: string, seatIndex: number, isHost: boolean = false, isBot: boolean = false) {
        this.id = id;
        this.name = name;
        this.seatIndex = seatIndex;
        this.isHost = isHost;
        this.isBot = isBot;
    }

    get handCount(): number {
        return this.hand.length;
    }

    addTile(tile: Tile) {
        this.hand.push(tile);
    }

    removeTile(tileId: string): Tile | undefined {
        const idx = this.hand.findIndex(t => t.id === tileId);
        if (idx === -1) return undefined;
        const [removed] = this.hand.splice(idx, 1);
        return removed;
    }

    // Simple sort for now, client will do complex grouping
    sortHand() {
        this.hand.sort((a, b) => {
            if (a.color !== b.color) return a.color.localeCompare(b.color);
            return a.value - b.value;
        });
    }
}
