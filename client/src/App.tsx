import { useState } from 'react';
import { LandscapeGuard } from './components/LandscapeGuard';
import { Lobby } from './pages/Lobby';

function App() {
  const [gameState, setGameState] = useState<any>(null); // Should use type from shared
  // Suppress unused warning
  console.log(gameState);
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
        <div className="w-full h-full flex items-center justify-center bg-felt-green">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Room: {roomId}</h2>
            <p>Waiting for players...</p>
            {/* <GameTable state={gameState} /> */}
          </div>
        </div>
      )}
    </LandscapeGuard>
  );
}

export default App;
