// 房間、NPC、物品、指令定義（中文版）
class MUD {
  constructor() {
    this.rooms = {
      hub: {
        name: '冒險者中心',
        description: '冒險者中心，所有旅程的起點。中央有一座發光的水晶柱，可以召喚你回到這裡。',
        exits: { north: 'forest', east: 'castle_gate', south: 'river', west: 'cave' },
        items: ['healing_potion', 'torch'],
        npcs: [],
      },
      forest: {
        name: '黑暗森林',
        description: '高聳的樹木遮住了天空，遠處傳來哥布林的咯咯笑聲。',
        exits: { north: 'cave', south: 'hub', east: 'river', west: 'castle_gate' },
        items: ['mushroom'],
        npcs: ['goblin'],
      },
      cave: {
        name: '哥布林洞窟',
        description: '岩洞深處，一名哥布林薩滿坐在骨頭堆成的寶座上，口中唸唸有詞。',
        exits: { north: null, south: 'hub', east: null, west: null },
        items: ['ancient_amulet'],
        npcs: ['goblin_shaman'],
      },
      river: {
        name: '河畔',
        description: '清澈的河流緩緩流過，一隻渡鴉停在原木上盯著你看。',
        exits: { north: null, south: null, east: null, west: 'hub' },
        items: ['fish'],
        npcs: ['raven'],
      },
      castle_gate: {
        name: '城堡大門',
        description: '厚重的石門敞開，一名衛兵筆直地站崗。北邊通向城堡內部。',
        exits: { north: 'castle_hall', south: 'hub', east: null, west: 'forest' },
        items: [],
        npcs: ['guard'],
      },
      castle_hall: {
        name: '城堡大廳',
        description: '莊嚴的大廳，牆上掛滿旗幟。北方寶座上，一隻巨龍正沉睡於黃金堆上。',
        exits: { north: 'treasure', south: 'castle_gate', east: null, west: null },
        items: ['sword', 'shield'],
        npcs: [],
      },
      treasure: {
        name: '龍的寶藏',
        description: '一座金山散發著漣漣漣的光，一隻龐大的巨龍盤踞其上，緩慢呼吸。',
        exits: { north: null, south: 'castle_hall', east: null, west: null },
        items: ['crown', 'diamond'],
        npcs: ['dragon'],
      },
    };

    this.hubRoom = 'hub';
    this.startRoom = 'hub';

    this.npcs = {
      goblin: {
        name: '哥布林',
        hp: 10,
        maxHp: 10,
        attack: 3,
        defense: 1,
        loot: ['金幣'],
        description: '一隻狡猾的小哥布林。',
      },
      goblin_shaman: {
        name: '哥布林薩滿',
        hp: 30,
        maxHp: 30,
        attack: 6,
        defense: 2,
        loot: ['薩滿法杖', '金幣'],
        description: '年老多經驗的哥布林薩滿，正低聲唸著邪惡咒語。',
      },
      raven: {
        name: '渡鴉',
        hp: 8,
        maxHp: 8,
        attack: 2,
        defense: 0,
        loot: ['渡鴉羽毛'],
        description: '一隻靈巧的黑渡鴉。',
      },
      guard: {
        name: '城堡衛兵',
        hp: 50,
        maxHp: 50,
        attack: 8,
        defense: 4,
        loot: ['護甲', '金幣'],
        description: '身披閃亮鎧甲的專業士兵。',
      },
      dragon: {
        name: '上古巨龍',
        hp: 100,
        maxHp: 100,
        attack: 15,
        defense: 8,
        loot: ['王冠', '鑽石', '金幣'],
        description: '龐大無比的龍，雙眼如餘燼般閃爍。',
      },
    };

    this.commands = {
      look:    this.cmdLook,
      l:       this.cmdLook,
      north:   this.cmdMoveNorth,
      south:   this.cmdMoveSouth,
      east:    this.cmdMoveEast,
      west:    this.cmdMoveWest,
      北:      this.cmdMoveNorth,
      南:      this.cmdMoveSouth,
      東:      this.cmdMoveEast,
      西:      this.cmdMoveWest,
      go:      this.cmdGo,
      移動:    this.cmdGo,
      hit:     this.cmdHit,
      攻擊:    this.cmdHit,
      kill:    this.cmdKill,
      attack:  this.cmdHit,
      inventory: this.cmdInventory,
      inv:     this.cmdInventory,
      背包:    this.cmdInventory,
      take:    this.cmdTake,
      撿起:    this.cmdTake,
      drop:    this.cmdDrop,
      放下:    this.cmdDrop,
      say:     this.cmdSay,
      說:      this.cmdSay,
      who:     this.cmdWho,
      誰:      this.cmdWho,
      help:    this.cmdHelp,
      說明:    this.cmdHelp,
      heal:    this.cmdHeal,
      治癒:    this.cmdHeal,
      status:  this.cmdStatus,
      狀態:    this.cmdStatus,
      s:       this.cmdStatus,
      recall:  this.cmdRecall,
      召回:    this.cmdRecall,
      quit:    this.cmdQuit,
      離開:    this.cmdQuit,
    };
  }

  processCommand(player, input) {
    const parts = input.trim().split(' ');
    if (parts.length === 0) return [];

    const cmd = parts[0];
    const args = parts.slice(1).join(' ');

    if (!this.commands[cmd]) {
      return [`未知指令："${cmd}"。輸入 "help" 查看指令清單。`];
    }

    const result = this.commands[cmd](player, args);
    return Array.isArray(result) ? result : [result];
  }

  cmdLook(player) {
    const room = this.rooms[player.room];
    const lines = [];
    lines.push(`你身在：${room.name}`);
    lines.push(room.description);
    lines.push('');

    // Show exits
    const exitDir = Object.keys(room.exits).filter(d => room.exits[d]);
    const dirCN = { north: '北', south: '南', east: '東', west: '西' };
    lines.push(`出入口：${exitDir.map(d => dirCN[d] || d).join('、') || '無'}`);

    // Show items on the floor
    if (room.items.length) {
      lines.push(`你看到：${room.items.join('、')}`);
    }

    // Show NPCs in the room
    const npcsHere = room.npcs.map(id => this.npcs[id].name).join('、');
    if (npcsHere) lines.push(`這裡還有：${npcsHere}`);

    // Show other players
    const otherPlayers = this.getPlayersInRoom(player.room, player.id);
    if (otherPlayers.length) {
      lines.push(`其他玩家：${otherPlayers.join('、')}`);
    }

    return lines;
  }

  cmdMoveNorth(player)  { return this.tryMove(player, 'north'); }
  cmdMoveSouth(player)  { return this.tryMove(player, 'south'); }
  cmdMoveEast(player)   { return this.tryMove(player, 'east'); }
  cmdMoveWest(player)   { return this.tryMove(player, 'west'); }

  cmdGo(player, args) {
    const alias = { '北': 'north', '南': 'south', '東': 'east', '西': 'west' };
    let dir = (args || '').toLowerCase();
    if (alias[dir]) dir = alias[dir];
    if (['north','south','east','west'].includes(dir)) {
      return this.tryMove(player, dir);
    }
    return [`你無法前往 "${args}"。`];
  }

  tryMove(player, direction) {
    const room = this.rooms[player.room];
    const target = room.exits[direction];
    if (!target) {
      return [`這個方向走不通。`];
    }

    player.room = target;
    const newRoom = this.rooms[target];

    const dirCN = { north: '向北', south: '向南', east: '向東', west: '向西' };
    const lines = [`你${dirCN[direction]}來到 ${newRoom.name}。`];
    lines.push(...this.cmdLook(player));
    return lines;
  }

  cmdRecall(player) {
    player.room = this.hubRoom;
    const room = this.rooms[this.hubRoom];
    const lines = [`你召喚水晶柱的力量，瞬間回到 ${room.name}。`];
    lines.push(...this.cmdLook(player));
    return lines;
  }

  cmdHit(player, args) {
    if (!args) {
      return ['你想攻擊誰？'];
    }

    const npcId = this.findNpcInRoom(player.room, args);
    if (!npcId) {
      const otherPlayer = this.findPlayerInRoom(player.room, args);
      if (otherPlayer) {
        const dmg = Math.max(1, (player.attack || 5) - (otherPlayer.defense || 0));
        otherPlayer.hp -= dmg;
        const lines = [
          `你攻擊 ${otherPlayer.name}，造成 ${dmg} 點傷害。`,
          otherPlayer.hp <= 0
            ? `${otherPlayer.name} 被打倒了！`
            : `${otherPlayer.name} 的生命：${otherPlayer.hp}/${otherPlayer.maxHp}`,
        ];
        return lines;
      }
      return [`這裡找不到名為 "${args}" 的目標。`];
    }

    const npc = this.npcs[npcId];
    const room = this.rooms[player.room];

    const dmg = Math.max(1, (player.attack || 5) - npc.defense);
    npc.hp -= dmg;

    const lines = [
      `你攻擊 ${npc.name}，造成 ${dmg} 點傷害。`,
      npc.hp <= 0
        ? `${npc.name} 被打倒了！`
        : `${npc.name} 的生命：${Math.max(0, npc.hp)}/${npc.maxHp}`,
    ];

    if (npc.hp <= 0) {
      // Remove NPC from room
      room.npcs = room.npcs.filter(id => id !== npcId);
      // Give loot
      if (npc.loot && npc.loot.length) {
        const lootMsg = `你獲得：${npc.loot.join('、')}`;
        lines.push(lootMsg);
        player.inventory.push(...npc.loot);
      }
    } else {
      // NPC retaliates
      const npcDmg = Math.max(1, npc.attack - (player.defense || 0));
      player.hp -= npcDmg;
      lines.push(`${npc.name} 反擊，造成 ${npcDmg} 點傷害。`);
      if (player.hp <= 0) {
        lines.push('你被打倒了！意識逐漸模糊...');
        lines.push(`你在 ${this.rooms[this.hubRoom].name} 蘇醒。`);
        this.respawnPlayer(player);
      }
    }

    return lines;
  }

  cmdKill(player, args) {
    return this.cmdHit(player, args);
  }

  cmdInventory(player) {
    if (!player.inventory || player.inventory.length === 0) {
      return ['你的背包是空的。'];
    }
    return ['你的背包：', ...player.inventory.map(i => `  - ${i}`)];
  }

  cmdTake(player, args) {
    if (!args) return ['你想撿起什麼？'];
    const room = this.rooms[player.room];
    const item = room.items.find(i => i.toLowerCase() === args.toLowerCase());
    if (!item) return [`這裡找不到 "${args}"。`];
    room.items = room.items.filter(i => i !== item);
    player.inventory.push(item);
    return [`你撿起了 ${item}。`];
  }

  cmdDrop(player, args) {
    if (!args) return ['你想放下什麼？'];
    const item = player.inventory.find(i => i.toLowerCase() === args.toLowerCase());
    if (!item) return [`你沒有 "${args}"。`];
    player.inventory = player.inventory.filter(i => i !== item);
    const room = this.rooms[player.room];
    room.items.push(item);
    return [`你放下了 ${item}。`];
  }

  cmdSay(player, args) {
    if (!args) return ['你想說些什麼？'];
    const players = this.getPlayersInRoom(player.room, player.id);
    if (players.length === 0) {
      return [`${player.name} 說："${args}"`];
    }
    return [`${player.name} 說："${args}"（${players.length} 名玩家聽見了）`];
  }

  cmdWho(player) {
    const players = this.getPlayersInRoom(player.room, player.id);
    if (players.length === 0) return ['你獨自一人在此。'];
    return [`在這個房間裡：${players.join('、')}`];
  }

  cmdHelp(player) {
    return [
      '=== MUD 指令清單 ===',
      'look / l      - 查看四周',
      'north/south/east/west（或 北/南/東/西） - 移動',
      'hit <目標>    - 攻擊目標',
      'inventory     - 查看背包',
      'take <物品>   - 撿起物品',
      'drop <物品>   - 放下物品',
      'say <文字>    - 說句話',
      'who           - 查看同房間的玩家',
      'heal          - 治癒（若有 potions）',
      'status / s    - 查看自身狀態',
      'recall        - 召回到冒險者中心',
      'quit          - 離開遊戲',
    ];
  }

  cmdHeal(player) {
    const idx = player.inventory.findIndex(i => i === 'healing_potion');
    if (idx === -1) return ['你沒有治癒 potions。'];
    player.inventory.splice(idx, 1);
    const healed = Math.min(20, player.maxHp - player.hp);
    player.hp += healed;
    return [`你喝下治癒 potions，恢復了 ${healed} 點生命。生命：${player.hp}/${player.maxHp}`];
  }

  cmdStatus(player) {
    return [
      `名字：${player.name}`,
      `位置：${this.rooms[player.room].name}`,
      `生命：${player.hp}/${player.maxHp}`,
      `攻擊：${player.attack}  防禦：${player.defense}`,
    ];
  }

  cmdQuit(player) {
    player.disconnected = true;
    return ['再見！期待你的下次冒險。'];
  }

  // --- 輔助函數 ---

  findNpcInRoom(roomId, targetName) {
    const room = this.rooms[roomId];
    if (!room) return null;
    const target = targetName.toLowerCase();
    const found = room.npcs.find(id =>
      this.npcs[id] && this.npcs[id].name.toLowerCase().includes(target)
    );
    return found || null;
  }

  findPlayerInRoom(roomId, targetName) {
    const target = targetName.toLowerCase();
    return this.players.find(p =>
      p.room === roomId && p.name.toLowerCase().includes(target)
    );
  }

  getPlayersInRoom(roomId, excludeId) {
    return (this.players || [])
      .filter(p => p.room === roomId && p.id !== excludeId && !p.disconnected)
      .map(p => p.name);
  }

  respawnPlayer(player) {
    player.room = this.hubRoom;
    player.hp = player.maxHp;
    player.disconnected = false;
  }
}

module.exports = MUD;
