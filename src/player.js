class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.room = 'hub';
    this.hp = 20;
    this.maxHp = 20;
    this.attack = 5;
    this.defense = 0;
    this.inventory = [];
    this.disconnected = false;
  }
}

module.exports = Player;
