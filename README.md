# MUD_R — Multi-User Dungeon

A Node.js-based text MUD (Multi-User Dungeon) game. Players connect via WebSocket and explore multiple rooms, fight NPCs, collect items, and chat with other players in real time.

## Tech Stack

| Layer | Tech |
|-------|------|
| Runtime | Node.js 20 |
| HTTP | Express |
| Real-time | ws (WebSocket) |
| Database | PostgreSQL (optional) |
| Deploy | Railway + Docker |

## Project Structure

```
├── src/
│   ├── server.js      # Express + WebSocket server entry point
│   ├── mud.js         # Game core: rooms, NPCs, commands
│   ├── player.js      # Player model
│   └── db.js          # PostgreSQL persistence layer
├── public/
│   └── index.html     # Terminal-style frontend UI
├── Dockerfile
├── railway.json
└── package.json
```

## Game Commands

| Command | Description |
|---------|-------------|
| `look` / `l` | Look around the current room |
| `north` / `south` / `east` / `west` | Move in a direction |
| `go <dir>` | Move (alternate) |
| `hit <target>` | Attack an NPC or player |
| `inventory` / `inv` | Show your items |
| `take <item>` | Pick up an item |
| `drop <item>` | Drop an item |
| `say <text>` | Chat with players in the room |
| `who` | List players in the room |
| `heal` | Use a healing potion |
| `status` / `s` | Show HP, room, name |
| `help` | Show command list |
| `quit` | Leave the game |

## Rooms

- **Village Square** (start) → Dark Forest, Castle Gate
- **Dark Forest** → Goblin Cave, River Bank, Village Square, Castle Gate
- **Goblin Cave** → Dark Forest (goblin shaman + portal)
- **River Bank** → Dark Forest (raven)
- **Castle Gate** → Castle Hall, Village Square, Dark Forest (guard)
- **Castle Hall** → Dragon Hoard, Castle Gate
- **Dragon Hoard** → Castle Hall (ancient dragon)

## Running Locally

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### With PostgreSQL

```bash
export DATABASE_URL=postgresql://user:pass@host:5432/mud_db
npm start
```

Without `DATABASE_URL`, the game runs in-memory mode.

## Deploying to Railway

1. Create a new project on [Railway](https://railway.app).
2. Connect the `mud_R` repository from GitHub.
3. Railway will automatically detect `Dockerfile` and build the image.
4. Add a **PostgreSQL** plugin (optional) and set the `DATABASE_URL` environment variable in your Railway service.
5. Open your public URL — the MUD is live!

### Railway Service Configuration

- **Port:** 3000
- **Start command:** `node src/server.js` (from `railway.json`)
- **Health check:** `/health` (optional)

## License

MIT
