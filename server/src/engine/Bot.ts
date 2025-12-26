import { Game } from './Game';
import { Player } from './Player';

export class Bot {
    static async playTurn(game: Game, player: Player) {
        if (!game.isTurn(player)) return;

        // Simulate thinking time
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            // 1. Draw
            // simple logic: draw from deck usually
            // check discard pile? if useful? 
            // Random choice for Easy bot
            const canDrawDiscard = game.discardPiles[(player.seatIndex - 1 + 4) % 4].length > 0;

            if (canDrawDiscard && Math.random() > 0.8) {
                game.drawFromDiscord(player.id);
            } else {
                game.drawTile(player.id);
            }

            // Simulate thinking time for discard
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 2. Discard
            // Pick a random tile to discard
            // Logic: Don't discard pairs or run pieces if possible.
            // Easy bot: Random non-joker

            const discardable = player.hand.filter(t => t.value !== 0); // avoid discarding fake okey if possible?
            const tileToDiscard = discardable.length > 0
                ? discardable[Math.floor(Math.random() * discardable.length)]
                : player.hand[0];

            game.discardTile(player.id, tileToDiscard.id);

        } catch (e) {
            console.error(`Bot ${player.name} error:`, e);
            // Fallback: try to pass turn?
        }
    }
}
