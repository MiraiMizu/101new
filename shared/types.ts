export type TileColor = 'red' | 'black' | 'blue' | 'yellow';

export interface Tile {
  id: string;
  value: number; // 1-13, or 0 for false okey? No, 1-13.
  color: TileColor;
  isJoker?: boolean; // The actual Okey tile
  isFakeOkey?: boolean; // The tile with value but acts as false okey
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  isHost: boolean;
  score: number;
  seatIndex: number; // 0-3
  isBot: boolean;
  isConnected: boolean;
  handCount: number; // For other players to see
}

export interface GameState {
  roomId: string;
  status: 'waiting' | 'playing' | 'ended';
  players: Player[];
  currentTurnParams: {
    seatIndex: number;
    deadline: number; // Timestamp
  };
  indicator: Tile; // The tile that determines the Joker
  centerPileCount: number;
  discardPiles: Record<number, Tile[]>; // specific discard pile for each player/seat? Usually just top tile is visible or previous.
}

export type GameEvent = 
  | 'room:update'
  | 'game:start'
  | 'turn:change'
  | 'tile:drawn'
  | 'player:joined'
  | 'player:left';

export const EVENTS = {
  ROOM_UPDATE: 'room:update',
  GAME_START: 'game:start',
  TURN_BEGIN: 'turn:begin',
  TILE_DRAWN: 'tile:drawn',
  TILE_DISCARD: 'tile:discard',
  GAME_END: 'game:end',
  CHAT_MESSAGE: 'chat:message',
  ERROR: 'error',
  JOIN_ROOM: 'room:join',
  CREATE_ROOM: 'room:create',
  PLAYER_ACTION: 'player:action',
} as const;
