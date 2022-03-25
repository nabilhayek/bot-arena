const Player = {
  name: 'Star',
  tick: function (Player, bots, bullets) {
    console.log('test', bullets);
    const enemies = bots.filter((bot) => bot.name !== Player.name);
    if (enemies.length < 1) {
      return;
    }

    if (enemies.length >= 1) {
      Player.shoot(enemies[0].x, enemies[0].y);
      Player.move(enemies[0].x - Player.x, enemies[0].y);
      for (bullets = 0; bullets < 10; bullets++) {
        Player.shoot(enemies[0].x, enemies[0].y);
      }
    }
  },
};

export default Player;
