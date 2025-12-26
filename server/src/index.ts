import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { RoomManager } from './RoomManager';
import { setupSocketHandlers } from './socketHandler';

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all for dev, restrict in prod
        methods: ["GET", "POST"]
    }
});

const roomManager = new RoomManager();

setupSocketHandlers(io, roomManager);

app.get('/health', (req, res) => {
    res.send('101 Okey Server is running');
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
