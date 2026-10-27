// 房間、NPC、物品、指令定義
class MUD {
  constructor() {
    this.rooms = {
      start: {
        name: 'Village Square',
        description: 'A small village square. A sign points North toward the Dark Forest. To the East, a castle gate looms.',
        exits: { north: 'forest', east: 'castle_gate', south: null, west: null },
        items: ['torch', 'healing_potion'],
        npcs: [],
      },
      forest: {
        name: 'Dark Forest',
        description: 'Tall trees block out the sky. You hear a goblin cackling nearby. Paths lead North, South and East.',
        exits: { north: 'cave', south: 'start', east: 'river', west: 'castle_gate' },
        items: ['mushroom'],
        npcs: ['goblin'],
      },
      cave: {
        name: 'Goblin Cave',
        description: 'A rocky cave. A goblin shaman sits on a throne of bones. A shimmering portal glows in the back.',
        exits: { north: null, south: 'forest', east: null, west: null },
        items: ['ancient_amulet'],
        npcs: ['goblin_shaman'],
      },
      river: {
        name: 'River Bank',
        description: 'A clear river flows gently. A raven sits on a log, watching you.',
        exits: { north: null, south: null, east: null, west: 'forest' },
        items: ['fish'],
        npcs: ['raven'],
      },
      castle_gate: {
        name: 'Castle Gate',
        description: 'Massive stone gates. A guard stands at attention. A path leads North into the castle.',
        exits: { north: 'castle_hall', south: 'start', east: null, west: 'forest' },
        items: [],
        npcs: ['guard'],
      },
      castle_hall: {
        name: 'Castle Hall',
        description: 'A grand hall. Banners line the walls. A dragon sleeps on a treasure pile in the North.',
        exits: { north: 'treasure', south: 'castle_gate', east: null, west: null },
        items: ['sword', 'shield'],
        npcs: [],
      },
      treasure: {
        name: 'Dragon Hoard',
        description: 'A mountain of gold. A massive dragon guards it, breathing smoke.',
        exits: { north: null, south: 'castle_hall', east: null, west: null },
        items: ['crown', 'diamond'],
        npcs: ['dragon'],
      },
    };

    this.npcs = {
      goblin: {
        name: 'Goblin',
        hp: 10,
        maxHp: 10,
        attack: 3,
        defense: 1,
        loot: ['gold'],
        description: 'A small, sneaky goblin.',
      },
      goblin_shaman: {
        name: 'Goblin Shaman',
        hp: 30,
        maxHp: 30,
        attack: 6,
        defense: 2,
        loot: ['shaman_staff', 'gold'],
        description: 'An old goblin shaman, muttering dark spells.',
      },
      raven: {
        name: 'Raven',
        hp: 8,
        maxHp: 8,
        attack: 2,
        defense: 0,
        loot: ['raven_feather'],
        description: 'A clever black raven.',
      },
      guard: {
        name: 'Castle Guard',
        hp: 50,
        maxHp: 50,
        attack: 8,
        defense: 4,
        loot: ['armor', 'gold'],
        description: 'A professional soldier in shining armor.',
      },
      dragon: {
        name: 'Ancient Dragon',
        hp: 100,
        maxHp: 100,
        attack: 15,
        defense: 8,
        loot: ['crown', 'diamond', 'gold'],
        description: 'A massive dragon, its eyes glowing like embers.',
      },
    };

    this.commands = {
      look:    this.cmdLook,
      north:   this.cmdMoveNorth,
      south:   this.cmdMoveSouth,
      east:    this.cmdMoveEast,
      west:    this.cmdMoveWest,
      go:      this.cmdGo,
      hit:     this.cmdHit,
      attack:  this.cmdHit,
      inventory: this.cmdInventory,
      inv:     this.cmdInventory,
      take:    this.cmdTake,
      drop:    this.cmdDrop,
      kill:    this.cmdKill,
      say:     this.cmdSay,
      who:     this.cmdWho,
      help:    this.cmdHelp,
      heal:    this.cmdHeal,
      status:  this.cmdStatus,
      quit:    this.cmdQuit,
    };
  }

  processCommand(player, input) {
    const parts = input.trim().split(' ');
    if (parts.length === 0) return [];

    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    if (!this.commands[cmd]) {
      return [`Unknown command: "${cmd}". Type "help" for a list of commands.`];
    }

    const result = this.commands[cmd](player, args);
    return Array.isArray(result) ? result : [result];
  }

  cmdLook(player) {
    const room = this.rooms[player.room];
    const lines = [];
    lines.push(`You are in: ${room.name}`);
    lines.push(room.description);
    lines.push('');

    // Show exits
    const exitNames = Object.keys(room.exits).filter(d => room.exits[d]);
    lines.push(`Exits: ${exitNames.join(', ') || 'None'}`);

    // Show items on the floor
    if (room.items.length) {
      lines.push(`You see: ${room.items.join(', ')}`);
    }

    // Show NPCs in the room
    const npcsHere = room.npcs.map(id => this.npcs[id].name).join(', ');
    if (npcsHere) lines.push(`You also see: ${npcsHere}`);

    // Show other players
    const otherPlayers = this.getPlayersInRoom(player.room, player.id);
    if (otherPlayers.length) {
      lines.push(`Also here: ${otherPlayers.join(', ')}`);
    }

    return lines;
  }

  cmdMoveNorth(player)  { return this.tryMove(player, 'north'); }
  cmdMoveSouth(player)  { return this.tryMove(player, 'south'); }
  cmdMoveEast(player)   { return this.tryMove(player, 'east'); }
  cmdMoveWest(player)   { return this.tryMove(player, 'west'); }

  cmdGo(player, args) {
    const dir = args.toLowerCase();
    if (['north','south','east','west'].includes(dir)) {
      return this.tryMove(player, dir);
    }
    return [`You can't go "${args}".`];
  }

  tryMove(player, direction) {
    const room = this.rooms[player.room];
    const target = room.exits[direction];
    if (!target) {
      return [`There is no exit to the ${direction}.`];
    }
    if (!this.rooms[target]) {
      return [`The ${direction} exit leads nowhere.`];
    }

    const oldRoom = this.rooms[player.room];
    oldRoom.npcs = oldRoom.npcs.filter(id => id !== player.id);

    player.room = target;
    const newRoom = this.rooms[target];

    const lines = [`You move ${direction} to ${newRoom.name}.`];
    lines.push(...this.cmdLook(player));
    return lines;
  }

  cmdHit(player, args) {
    if (!args) {
      return ['Who do you want to hit?'];
    }

    const npcId = this.findNpcInRoom(player.room, args);
    if (!npcId) {
      const otherPlayer = this.findPlayerInRoom(player.room, args);
      if (otherPlayer) {
        const dmg = Math.max(1, (player.attack || 5) - (otherPlayer.defense || 0));
        otherPlayer.hp -= dmg;
        const lines = [
          `You attack ${otherPlayer.name} for ${dmg} damage.`,
          otherPlayer.hp <= 0
            ? `${otherPlayer.name} has been defeated!`
            : `${otherPlayer.name}'s HP: ${otherPlayer.hp}/${otherPlayer.maxHp}`,
        ];
        return lines;
      }
      return [`You can't find anyone named "${args}" to hit.`];
    }

    const npc = this.npcs[npcId];
    const room = this.rooms[player.room];

    const dmg = Math.max(1, (player.attack || 5) - npc.defense);
    npc.hp -= dmg;

    const lines = [
      `You hit ${npc.name} for ${dmg} damage.`,
      npc.hp <= 0
        ? `${npc.name} has been defeated!`
        : `${npc.name}'s HP: ${Math.max(0, npc.hp)}/${npc.maxHp}`,
    ];

    if (npc.hp <= 0) {
      // Remove NPC from room
      room.npcs = room.npcs.filter(id => id !== npcId);
      // Give loot
      if (npc.loot && npc.loot.length) {
        const lootMsg = `You got: ${npc.loot.join(', ')}`;
        lines.push(lootMsg);
        player.inventory.push(...npc.loot);
      }
    } else {
      // NPC retaliates
      const npcDmg = Math.max(1, npc.attack - (player.defense || 0));
      player.hp -= npcDmg;
      lines.push(`${npc.name} strikes back for ${npcDmg} damage.`);
      if (player.hp <= 0) {
        lines.push('You have been defeated! You lose consciousness...');
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
      return ['Your inventory is empty.'];
    }
    return ['Your inventory:', ...player.inventory.map(i => `  - ${i}`)];
  }

  cmdTake(player, args) {
    if (!args) return ['Take what?'];
    const room = this.rooms[player.room];
    const item = room.items.find(i => i.toLowerCase() === args.toLowerCase());
    if (!item) return [`You can't find "${args}" here.`];
    room.items = room.items.filter(i => i !== item);
    player.inventory.push(item);
    return [`You picked up the ${item}.`];
  }

  cmdDrop(player, args) {
    if (!args) return ['Drop what?'];
    const item = player.inventory.find(i => i.toLowerCase() === args.toLowerCase());
    if (!item) return [`You don't have "${args}".`];
    player.inventory = player.inventory.filter(i => i !== item);
    const room = this.rooms[player.room];
    room.items.push(item);
    return [`You dropped the ${item}.`];
  }

  cmdSay(player, args) {
    if (!args) return ['What do you say?'];
    const players = this.getPlayersInRoom(player.room, player.id);
    if (players.length === 0) {
      return [`${player.name} says: "${args}"`];
    }
    return [`(${players.length} player(s) nearby hear you)`];
  }

  cmdWho(player) {
    const players = this.getPlayersInRoom(player.room, player.id);
    if (players.length === 0) return ['You are alone in this room.'];
    return [`In this room: ${players.join(', ')}`];
  }

  cmdHelp(player) {
    return [
      '=== MUD Commands ===',
      'look / l        - Look around',
      'north/south/east/west - Move',
      'hit <target>    - Attack a target',
      'inventory / inv - Show your items',
      'take <item>     - Pick up an item',
      'drop <item>     - Drop an item',
      'say <text>      - Say something',
      'who             - List players in the room',
      'heal            - Heal yourself (if you have a potion)',
      'status / s      - Show your HP',
      'quit            - Leave the game',
    ];
  }

  cmdHeal(player) {
    const idx = player.inventory.findIndex(i => i === 'healing_potion');
    if (idx === -1) return ['You don\'t have a healing potion.'];
    player.inventory.splice(idx, 1);
    const healed = Math.min(20, player.maxHp - player.hp);
    player.hp += healed;
    return [`You drink the healing potion. You recover ${healed} HP. HP: ${player.hp}/${player.maxHp}`];
  }

  cmdStatus(player) {
    return [
      `Name: ${player.name}`,
      `Room: ${this.rooms[player.room].name}`,
      `HP: ${player.hp}/${player.maxHp}`,
    ];
  }

  cmdQuit(player) {
    player.disconnected = true;
    return ['Goodbye!'];
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
    player.room = 'start';
    player.hp = player.maxHp;
    player.disconnected = false;
  }
}

module.exports = MUD;
