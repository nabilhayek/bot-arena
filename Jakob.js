const Player = {
  name: 'Jake The Drake',
  tick: function (Player, bots, bullets) {
    const enemies = bots.filter((bot) => bot.name !== Player.name);
    if (enemies.length < 1) return;
    Player.shoot(enemies[0].x, enemies[0].y);
    const moveFromShots = () => {
      if (enemies[0].x === Player.x) Player.move(enemies[3].x, 302);
    };
    moveFromShots();
    Player.move(302, 0);
  },
};
export default Player;
