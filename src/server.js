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

// 健康檢查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// 遊戲核心
const mud = new MUD();

// 初始化資料庫
(async () => {
  const dbUrl = process.env.DATABASE_URL;
  db.initDb(dbUrl);
  await db.setupTables();
  console.log('Database initialized');
})();

// WebSocket
const wss = new WebSocket.Server({ server, path: '/ws' });
const clientMap = new Map(); // playerId -> ws

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://localhost');
  const playerId = url.searchParams.get('player') || uuidv4();
  const playerName = url.searchParams.get('name') || '旅者_' + playerId.slice(0, 4);

  // 嘗試載入玩家
  db.loadPlayer(playerId).then(saved => {
    let player;
    if (saved) {
      player = saved;
      player.disconnected = false;
    } else {
      player = new Player(playerId, playerName);
    }

    ws.player = player;
    clientMap.set(playerId, ws);

    // 發送歡迎訊息
    const roomName = mud.rooms[player.room] ? mud.rooms[player.room].name : '冒險者中心';
    const welcome = [
      '=== 歡迎來到「萬王之王」MUD ===',
      `見識一下吧，${player.name}！你身在 ${roomName}。`,
      '亞特蘭狄斯王國正在邪神的陰影下掙扎，冒險者啊，拿起你的武器。',
      '輸入 "help" 查看指令清單。',
      '',
    ];
    welcome.forEach(line => ws.send(JSON.stringify({ text: line })));
  });

  ws.on('message', (raw) => {
    if (!ws.player) return;
    const input = raw.toString().trim();
    if (!input) return;

    // 處理指令
    const lines = mud.processCommand(ws.player, input);
    lines.forEach(line => {
      ws.send(JSON.stringify({ text: line }));
    });

    // 廣播給同房間的其他玩家
    const cmd = input.split(' ')[0];
    if (['north','south','east','west','go','說','say'].includes(cmd.toLowerCase()) ||
        ['北','南','東','西','移動','說'].includes(cmd)) {
      const dirCN = { north: '向北', south: '向南', east: '向東', west: '向西', go: '移動', 移動: '移動', northCN: '向北' };
      const parts = input.split(' ');
      let msg;
      if (cmd.toLowerCase() === 'say' || cmd === '說') {
        msg = `${ws.player.name} 說："${parts.slice(1).join(' ')}"`;
      } else {
        const dirName = parts[1] ? (dirCN[parts[1]] || parts[1]) : '';
        msg = `${ws.player.name} ${dirName || '移動了'}`;
      }
      clientMap.forEach((client, clientId) => {
        if (clientId === ws.player.id || !client || client.readyState !== WebSocket.OPEN) return;
        if (client.player && client.player.room === ws.player.room) {
          client.send(JSON.stringify({ text: msg }));
        }
      });
    }

    // 持久化
    db.savePlayer(ws.player);
  });

  ws.on('close', () => {
    clientMap.delete(playerId);
    if (ws.player) {
      ws.player.disconnected = true;
      db.savePlayer(ws.player);
    }
    ws.player = null;
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`MUD server running on port ${PORT}`);
});
