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

## Deployment

### Architecture Note
This is a **Full Stack** application. It has two parts that must run simultaneously:
1.  **Frontend**: The React UI (can be hosted on Cloudflare Pages, Vercel, Netlify).
2.  **Backend**: The Node.js Server (MUST be hosted on a service that supports long-running processes, like Render, Railway, or Heroku).

**The issue "Cannot create room" usually happens because the Frontend cannot find the Backend.**

### Step 1: Deploy Backend (Render.com)
1.  Push this code to GitHub.
2.  Sign up for [Render.com](https://render.com).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Build Command**: `cd shared && npm install && npm run build && cd ../server && npm install && npm run build`
6.  **Start Command**: `cd server && npm start`
7.  Copy your new Backend URL (e.g., `https://my-game.onrender.com`).

### Step 2: Configure Frontend (Cloudflare Pages)
1.  Go to your Cloudflare Pages project settings.
2.  Navigate to **Settings** -> **Environment Variables**.
3.  Add a variable:
    -   Key: `VITE_API_URL`
    -   Value: `https://my-game.onrender.com` (The URL from Step 1)
4.  **Redeploy** your latest commit to Cloudflare so it picks up the new variable.

## Tech Stack
- Backend: Express, Socket.io
- Frontend: React, Vite, Tailwind, Framer Motion
- Lang: TypeScript
