# 101 Okey Online

A production-ready online 101 Okey web game built with Node.js, Socket.io, React, and TailwindCSS.

## Features
- **Multiplayer**: Real-time gameplay for 2-4 players.
- **Mobile First**: Enforced landscape mode for optimal experience on mobile devices.
- **Bot Support**: Play against AI bots if seats are empty.
- **Modern UI**: Clean, responsive aesthetic with classic Okey felt design.

## Project Structure
- `/client`: React frontend
- `/server`: Node.js backend
- `/shared`: Shared TypeScript types
- `docker-compose.yml`: Container orchestration

## Getting Started

### Prerequisites
- Node.js v18+
- Docker (optional)

### Running Locally (Dev)
1. Install Shared Dependencies
   ```bash
   cd shared
   npm install && npm run build
   ```

2. Start Server
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. Start Client
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Running with Docker
```bash
docker-compose up --build
```

## Game Rules
- Standard 101 Okey rules apply.
- Minimum open score: 101.
- Men join with Room Code.

## Tech Stack
- Backend: Express, Socket.io
- Frontend: React, Vite, Tailwind, Framer Motion
- Lang: TypeScript
