const http = require('http');
const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const MUD = require('./mud');
const Player = require('./player');
const db = require('./db');

const app = express();
const server = http.createServer(app);

// 提供前端
app.use(express.static(path.join(__dirname, '..', 'public')));

// 遊戲核心
const mud = new MUD();
mud.players = [];

// 初始化資料庫
(async () => {
  const dbUrl = process.env.DATABASE_URL;
  db.initDb(dbUrl);
  await db.setupTables();
  console.log('Database initialized');
})();

// WebSocket
const wss = new WebSocket.Server({ server, path: '/ws' });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://localhost');
  const playerId = url.searchParams.get('player') || uuidv4();
  const playerName = url.searchParams.get('name') || 'Guest_' + playerId.slice(0, 4);

  let player = null;

  // 嘗試載入玩家
  db.loadPlayer(playerId).then(saved => {
    if (saved) {
      player = saved;
      player.disconnected = false;
    } else {
      player = new Player(playerId, playerName);
    }

    mud.players.push(player);
    ws.player = player;

    // 發送歡迎訊息
    const welcome = [
      '=== Welcome to MUD ===',
      `Hello, ${player.name}! You are in the ${mud.rooms[player.room].name}.`,
      'Type "help" for a list of commands.',
      '',
    ];
    welcome.forEach(line => ws.send(JSON.stringify({ text: line })));
  });

  ws.on('message', async (raw) => {
    if (!ws.player) return;
    const input = raw.toString().trim();
    if (!input) return;

    // 處理指令
    const lines = mud.processCommand(ws.player, input);
    lines.forEach(line => {
      ws.send(JSON.stringify({ text: line }));
    });

    // 廣播給同房間的其他玩家
    const room = mud.rooms[ws.player.room];
    const otherPlayers = mud.players.filter(
      p => p.room === ws.player.room && p.id !== ws.player.id && !p.disconnected
    );
    const cmd = input.split(' ')[0].toLowerCase();
    if (['north','south','east','west','go','say'].includes(cmd)) {
      const message = cmd === 'say' ? ws.player.name + ' says: "' + input.split(' ').slice(1).join(' ') + '"'
        : ws.player.name + ' moves ' + (cmd === 'go' ? input.split(' ')[1] : cmd);
      otherPlayers.forEach(p => {
        const client = wss.clients.get(p.id);
        if (client && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ text: message }));
        }
      });
    }

    // 持久化
    await db.savePlayer(ws.player);
  });

  ws.on('close', async () => {
    if (ws.player) {
      ws.player.disconnected = true;
      mud.players = mud.players.filter(p => p.id !== ws.player.id);
      await db.savePlayer(ws.player);
    }
  });

  // 追蹤客戶端
  wss.clients = new Map();
  wss.clients.set(playerId, ws);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`MUD server running on port ${PORT}`);
});
