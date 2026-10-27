const { Pool } = require('pg');

let pool = null;

function initDb(databaseUrl) {
  if (!databaseUrl) {
    console.log('No DATABASE_URL set, using in-memory mode');
    return null;
  }
  pool = new Pool({ connectionString: databaseUrl });
  return pool;
}

async function savePlayer(player) {
  if (!pool) return;
  await pool.query(
    `INSERT INTO players (id, name, room, hp, max_hp, attack, defense, inventory)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE SET
       room=$3, hp=$4, max_hp=$5, attack=$6, defense=$7, inventory=$8`,
    [player.id, player.name, player.room, player.hp, player.maxHp,
     player.attack, player.defense, JSON.stringify(player.inventory)]
  );
}

async function loadPlayer(id) {
  if (!pool) return null;
  const res = await pool.query('SELECT * FROM players WHERE id = $1', [id]);
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  const Player = require('./player');
  const p = new Player(row.id, row.name);
  p.room = row.room;
  p.hp = row.hp;
  p.maxHp = row.max_hp;
  p.attack = row.attack;
  p.defense = row.defense;
  p.inventory = JSON.parse(row.inventory || '[]');
  return p;
}

async function setupTables() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS players (
      id UUID PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      room VARCHAR(50) NOT NULL DEFAULT 'start',
      hp INTEGER NOT NULL DEFAULT 20,
      max_hp INTEGER NOT NULL DEFAULT 20,
      attack INTEGER NOT NULL DEFAULT 5,
      defense INTEGER NOT NULL DEFAULT 0,
      inventory JSONB NOT NULL DEFAULT '[]',
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

module.exports = { initDb, savePlayer, loadPlayer, setupTables };
