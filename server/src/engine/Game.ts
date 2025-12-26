import { Deck } from './Deck';
import { Player } from './Player';
import { Tile } from './Tile';
import { GameState, Tile as ITile } from '@101okey/shared';

export class Game {
    id: string;
    players: Player[];
    deck: Deck;
    status: 'waiting' | 'playing' | 'ended' = 'waiting';

    currentPlayerIndex: number = 0;
    indicator: Tile | null = null;
    okeyTile: Tile | null = null;

    discardPiles: Record<number, Tile[]> = {};

    constructor(id: string) {
        this.id = id;
        this.players = [];
        this.deck = new Deck();
    }

    addPlayer(player: Player) {
        if (this.players.length >= 4) throw new Error('Room full');
        this.players.push(player);
        this.discardPiles[player.seatIndex] = [];
    }

    start() {
        if (this.players.length < 2) throw new Error('Not enough players');
        this.status = 'playing';
        this.deck.initialize();
        this.deck.shuffle();

        // Draw indicator
        this.indicator = this.deck.draw()!;
        this.okeyTile = this.deck.determineOkey(this.indicator);

        // Distribute tiles
        // 1st player gets 22, others 21
        // Standard 101 rules:
        // Deal 5-5-5-5 then remainder

        // Simple deal for MVP:
        // Player 0 gets 22
        // Others get 21

        const startingPlayerIndex = Math.floor(Math.random() * this.players.length);
        this.currentPlayerIndex = startingPlayerIndex;

        this.players.forEach((p, idx) => {
            const count = (idx === startingPlayerIndex) ? 22 : 21;
            for (let i = 0; i < count; i++) {
                const t = this.deck.draw();
                if (t) p.addTile(t);
            }
            p.sortHand();
        });
    }

    drawTile(playerId: string) {
        const player = this.getPlayer(playerId);
        if (!this.isTurn(player)) throw new Error('Not your turn');

        const tile = this.deck.draw();
        if (!tile) throw new Error('Deck empty'); // Should handle reshuffle of discards if rules allow, or game end

        player.addTile(tile);
        return tile;
    }

    drawFromDiscord(playerId: string) {
        const player = this.getPlayer(playerId);
        if (!this.isTurn(player)) throw new Error('Not your turn');

        // Previous player seat
        // Logic to find valid discard pile to draw from (usually Left neighbor)
        // For now, assume linear seat order 0-1-2-3-0
        const prevSeat = (player.seatIndex - 1 + 4) % 4;
        const pile = this.discardPiles[prevSeat]; // Validation needed to ensure player exists at seat

        if (!pile || pile.length === 0) throw new Error('No discard to draw');

        const tile = pile.pop()!;
        player.addTile(tile);
        return tile;
    }

    discardTile(playerId: string, tileId: string) {
        const player = this.getPlayer(playerId);
        // Validation: Must have drawn first? 
        // In 101, you draw then discard.
        // We need state to track if they have drawn.
        // For MVP, just check hand count? 
        // If hand count == 22, they must discard to end turn.

        if (!this.isTurn(player)) throw new Error('Not your turn');

        const tile = player.removeTile(tileId);
        if (!tile) throw new Error('Tile not in hand');

        this.discardPiles[player.seatIndex].push(tile);
        this.nextTurn();
    }

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

        // Check if next player is bot
        const player = this.players[this.currentPlayerIndex];
        if (player.isBot) {
            // We need to avoid circular dependency import if possible, or use a handler.
            // Ideally Game shouldn't depend on Bot, but Bot on Game.
            // However, for this simple engine, we can import or trigger an event.
            // Since Bot is static, we can try dynamic import or just import at top if no cycle.
            // Doing a simple timeout to simulate async turn
            setTimeout(() => {
                // Import Bot here or assumes it's available.
                // Let's use a "TurnManager" or similar pattern ideally.
                // For MVP:
                import('./Bot').then(({ Bot }) => {
                    Bot.playTurn(this, player);
                });
            }, 500);
        }
    }

    isTurn(player: Player): boolean {
        return this.players[this.currentPlayerIndex].id === player.id;
    }

    getPlayer(id: string): Player {
        const p = this.players.find(x => x.id === id);
        if (!p) throw new Error('Player not found');
        return p;
    }

    getState(forPlayerId?: string): GameState {
        // Sanitize players list: hide hands of others
        const serializedPlayers = this.players.map(p => {
            // We return a clean object matching the Shared interface
            // If it's the requesting player, we MIGHT include the hand,
            // but typically the client handles the hand separately or we extend the interface.
            // For standard GameState updates broadcasted to all, we must NOT include hands.
            // If forPlayerId is provided, we could include it, but the Types usually don't have 'hand'.
            // The client receives 'hand' via specific 'tile:drawn' or initial deal events, 
            // OR we can send a separate "myHand" event.
            // For MVP simplicity and safety: 
            // We will send 'hand' ONLY if forPlayerId matches.
            // BUT the Player interface in 'shared' likely doesn't have 'hand'.
            // We need to cast or rely on the client knowing.
            const { hand, ...rest } = p;
            return {
                ...rest,
                handCount: p.handCount,
                // Only include hand if it's the current player asking (and update type definition if needed)
                // For now, keep it secure: no hand in public state.
                // Client relies on private events or we add a 'hand' field to the protocol.
            };
        });

        return {
            roomId: this.id,
            status: this.status,
            players: serializedPlayers as any, // Cast to avoid type mismatch if local Player has extra fields
            currentTurnParams: {
                seatIndex: this.players[this.currentPlayerIndex].seatIndex,
                deadline: Date.now() + 60000
            },
            indicator: this.indicator!,
            centerPileCount: this.deck.tiles.length,
            discardPiles: this.discardPiles
        };
    };
}
