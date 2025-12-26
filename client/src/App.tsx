import { useState } from 'react';
import { LandscapeGuard } from './components/LandscapeGuard';
import { Lobby } from './pages/Lobby';
import { GameTable } from './components/GameTable';
import { socketService } from './services/socket';

function App() {
  const [gameState, setGameState] = useState<any>(null); // Should use type from shared
  const [roomId, setRoomId] = useState<string | null>(null);

  const handleJoin = (id: string, state: any) => {
    setRoomId(id);
    setGameState(state);
  };

  return (
    <LandscapeGuard>
      {!roomId ? (
        <Lobby onJoin={handleJoin} />
      ) : (
        <GameTable initialState={gameState} myId={socketService.socket?.id || ''} />
      )}
    </LandscapeGuard>
  );
}

export default App;
