import { Deck } from '../src/engine/Deck';

describe('Deck Logic', () => {
    test('should initialize with 106 tiles', () => {
        const deck = new Deck();
        expect(deck.tiles.length).toBe(106);
    });

    test('should have correct distribution', () => {
        const deck = new Deck();
        const reds = deck.tiles.filter(t => t.color === 'red' && t.value > 0);
        expect(reds.length).toBe(26); // 13 * 2

        const fakeOkeys = deck.tiles.filter(t => t.value === 0);
        expect(fakeOkeys.length).toBe(2);
    });

    test('should determine correct Okey', () => {
        const deck = new Deck();
        // Mock indicator: Red 5
        const indicator = deck.tiles.find(t => t.color === 'red' && t.value === 5)!;
        const okey = deck.determineOkey(indicator);
        expect(okey.color).toBe('red');
        expect(okey.value).toBe(6);
    });

    test('should wrap 13 to 1 for Okey', () => {
        const deck = new Deck();
        // Mock indicator: Blue 13
        const indicator = deck.tiles.find(t => t.color === 'blue' && t.value === 13)!;
        const okey = deck.determineOkey(indicator);
        expect(okey.color).toBe('blue');
        expect(okey.value).toBe(1);
    });
});
