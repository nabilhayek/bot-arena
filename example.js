const Player = {
  name: 'Example',
  tick: function (Player, bots, bullets) {
    const enemies = bots.filter((bot) => bot.name !== Player.name);
    if (enemies.length < 1) return;

    Player.shoot(enemies[0].x, enemies[0].y);
    Player.move(enemies[0].x - Player.x, enemies[0].y - Player.y);
  },
};

export default Player;
