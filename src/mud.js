// 房間、NPC、物品、指令定義（萬王之王 King of Kings 世界觀）
class MUD {
  constructor() {
    this.rooms = {
      hub: {
        name: '冒險者中心',
        biome: 'hub',
        description: '王城亞特蘭狄斯（Atlantis）的冒險者中心，中央矗立著聖殿水晶柱，發出柔和的金光。據說它是王國與眾神交會之處，召喚之力可將旅人送回此地。',
        exits: { north: 'forest', east: 'castle_gate', south: 'river', west: 'cave' },
        items: ['healing_potion', 'torch'],
        npcs: [],
      },
      forest: {
        name: '密語森林',
        biome: 'forest',
        description: '古老橡樹層疊遮蔽天日，遠處傳來獸人的嚎叫。傳說這裡曾是「大惡魔」殘軍盤踞之地。',
        exits: { north: 'cave', south: 'hub', east: 'river', west: 'castle_gate' },
        items: ['mushroom'],
        npcs: ['goblin'],
      },
      cave: {
        name: '幽暗洞窟',
        biome: 'cave',
        description: '岩洞深處，一名薩滿盤坐於骸骨寶座之上，低聲頌唱邪神「大惡魔」的咒文，黑霧繚繞。',
        exits: { north: null, south: 'hub', east: null, west: null },
        items: ['ancient_amulet'],
        npcs: ['shaman'],
      },
      river: {
        name: '銀河河畔',
        biome: 'river',
        description: '銀色河水映照天光緩緩流動，一隻渡鴉棲於朽木上，冷眼注視著你。',
        exits: { north: null, south: null, east: null, west: 'hub' },
        items: ['fish'],
        npcs: ['raven'],
      },
      castle_gate: {
        name: '王城大門',
        biome: 'castle',
        description: '雄偉的石門上鑲著王國徽記。一名騎士筆直站崗，腰間佩劍閃著冷光。門北通往王城內部。',
        exits: { north: 'castle_hall', south: 'hub', east: null, west: 'forest' },
        items: [],
        npcs: ['guard'],
      },
      castle_hall: {
        name: '王城大廳',
        biome: 'castle',
        description: '莊嚴的王城大廳，四壁懸掛著歷代王者的旗幟。北方深處，寶座之上盤踞著邪惡的巨龍。',
        exits: { north: 'treasure', south: 'castle_gate', east: null, west: null },
        items: ['sword', 'shield'],
        npcs: [],
      },
      treasure: {
        name: '巨龍寶藏',
        biome: 'treasure',
        description: '一座金山散發著漣漣金光，龐大的巨龍盤踞其上，雙眼如餘燼般緩緩呼吸。王冠與鑽石埋於其中。',
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
        description: '一隻狡猾的小哥布林，據說是大惡魔遺留的雜兵。',
      },
      shaman: {
        name: '哥布林薩滿',
        hp: 30,
        maxHp: 30,
        attack: 6,
        defense: 2,
        loot: ['薩滿法杖', '金幣'],
        description: '邪神大惡魔的祭司，正低聲頌唱詛咒，黑霧繚繞周身。',
      },
      raven: {
        name: '渡鴉',
        hp: 8,
        maxHp: 8,
        attack: 2,
        defense: 0,
        loot: ['渡鴉羽毛'],
        description: '一隻靈巧的黑渡鴉，傳言能傳遞訊息給遠方的王城。',
      },
      guard: {
        name: '王城衛兵',
        hp: 50,
        maxHp: 50,
        attack: 8,
        defense: 4,
        loot: ['騎士護甲', '金幣'],
        description: '身披閃亮鎧甲的王國騎士，正筆直地站崗。',
      },
      dragon: {
        name: '上古巨龍',
        hp: 100,
        maxHp: 100,
        attack: 15,
        defense: 8,
        loot: ['王者王冠', '純鑽', '金幣'],
        description: '龐大無比的巨龍，雙眼如餘燼般閃爍。傳說它是邪神大惡魔麾下最後的守寶者。',
      },
    };

    this.commands = {
      look:    this.cmdLook,
      l:       this.cmdLook,
      環顧:    this.cmdLook,
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

    // 顯示出入口
    const exitDir = Object.keys(room.exits).filter(d => room.exits[d]);
    const dirCN = { north: '北', south: '南', east: '東', west: '西' };
    lines.push(`出入口：${exitDir.map(d => dirCN[d] || d).join('、') || '無'}`);

    // 顯示地上的物品
    if (room.items.length) {
      lines.push(`你看到：${room.items.join('、')}`);
    }

    // 顯示房間內的 NPC
    if (room.npcs.length) {
      lines.push(`在附近：${room.npcs.map(id => this.npcs[id].name).join('、')}`);
    }

    return lines;
  }

  cmdMoveNorth(player)  { return this.doMove(player, 'north'); }
  cmdMoveSouth(player)  { return this.doMove(player, 'south'); }
  cmdMoveEast(player)   { return this.doMove(player, 'east'); }
  cmdMoveWest(player)   { return this.doMove(player, 'west'); }

  cmdGo(player, args) {
    if (!args) return ['你想往哪個方向移動？'];
    const map = { north: 'north', 北: 'north', south: 'south', 南: 'south', east: 'east', 東: 'east', west: 'west', 西: 'west' };
    const dir = map[args];
    if (!dir) return [`未知方向："${args}"。可往 north、south、east、west（北、南、東、西）。`];
    return this.doMove(player, dir);
  }

  doMove(player, dir) {
    const room = this.rooms[player.room];
    const target = room.exits[dir];
    if (!target) return ['這個方向沒有出入口。'];
    player.room = target;
    const targetRoom = this.rooms[target];
    return [
      `你向${dir === 'north' ? '北' : dir === 'south' ? '南' : dir === 'east' ? '東' : '西'}移動。`,
      '',
      `你身在：${targetRoom.name}`,
      targetRoom.description,
      `出入口：${Object.keys(targetRoom.exits).filter(d => targetRoom.exits[d]).map(d => ({ north: '北', south: '南', east: '東', west: '西' })[d] || d).join('、') || '無'}`,
    ];
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
      room.npcs = room.npcs.filter(id => id !== npcId);
      if (npc.loot && npc.loot.length) {
        const lootMsg = `你獲得：${npc.loot.join('、')}`;
        lines.push(lootMsg);
        player.inventory.push(...npc.loot);
      }
    } else {
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
      '=== 萬王之王 MUD 指令清單 ===',
      'look / l      - 環顧四周',
      'north/south/east/west（或 北/南/東/西） - 移動',
      'hit <目標>    - 攻擊目標',
      'inventory     - 查看背包',
      'take <物品>   - 撿起物品',
      'drop <物品>   - 放下物品',
      'say <文字>    - 說句話',
      'who           - 查看同房間的玩家',
      'heal          - 治癒（若有治癒 potions）',
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

  cmdRecall(player) {
    player.room = this.hubRoom;
    const room = this.rooms[this.hubRoom];
    return [
      `你召喚了聖殿水晶柱的力量，回到了 ${room.name}。`,
      '',
      `你身在：${room.name}`,
      room.description,
      `出入口：${Object.keys(room.exits).filter(d => room.exits[d]).map(d => ({ north: '北', south: '南', east: '東', west: '西' })[d] || d).join('、') || '無'}`,
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
