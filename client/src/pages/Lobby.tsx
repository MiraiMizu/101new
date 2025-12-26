import React, { useState } from 'react';
import { socketService } from '../services/socket';
import { User, Play } from 'lucide-react';

interface LobbyProps {
    onJoin: (roomId: string, state: any) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onJoin }) => {
    const [name, setName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name) return setError('Please enter your name');
        setLoading(true);
        try {
            socketService.connect();
            const res = await socketService.createRoom(name);
            onJoin(res.roomId, res.state);
        } catch (err: any) {
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!name) return setError('Please enter your name');
        if (!roomId) return setError('Please enter a room code');
        setLoading(true);
        try {
            socketService.connect();
            const res = await socketService.joinRoom(roomId.toUpperCase(), name);
            onJoin(res.roomId, res.state);
        } catch (err: any) {
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-felt-green text-white p-4">
            <div className="bg-felt-dark p-8 rounded-xl shadow-2xl border-4 border-wood-dark w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-8 drop-shadow-md text-wood-light">101 Okey Online</h1>

                {error && (
                    <div className="bg-red-500/80 text-white p-3 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-wood-light">Your Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-wood-dark rounded focus:outline-none focus:border-wood-light transition-colors text-white placeholder-gray-500"
                                placeholder="Enter nickname..."
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <label className="block text-sm font-medium mb-1 text-wood-light">Join Existing Room</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                className="flex-1 px-4 py-2 bg-black/30 border border-wood-dark rounded uppercase tracking-widest focus:outline-none focus:border-wood-light transition-colors placeholder-gray-500"
                                placeholder="CODE"
                                maxLength={6}
                            />
                            <button
                                onClick={handleJoin}
                                disabled={loading}
                                className="bg-wood-dark hover:bg-wood-light hover:text-wood-dark text-wood-light font-bold py-2 px-6 rounded transition-colors disabled:opacity-50"
                            >
                                JOIN
                            </button>
                        </div>
                    </div>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Play size={20} fill="currentColor" />
                        CREATE NEW TABLE
                    </button>
                </div>
            </div>

            <p className="mt-8 text-white/40 text-sm">v1.0.0 • Mobile Landscape Only</p>
        </div>
    );
};
