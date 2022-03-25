const Player = {
  name: 'Nabil',
  tick: function (Player, bots, bullets) {
    const enemies = bots.filter((bot) => bot.name !== Player.name);
    if (enemies.length < 1) return;

    const closestEnemy = enemies.reduce(
      (prev, curr) => {
        const distance = Math.sqrt(
          Math.pow(Player.x - curr.x, 2) + Math.pow(Player.y - curr.y, 2)
        );
        if (distance < prev.distance) {
          return {
            distance: distance,
            bot: curr,
          };
        }
        return prev;
      },
      { distance: Infinity }
    );

    Player.shoot(closestEnemy.bot.x, closestEnemy.bot.y);

    const enemyBullets = bullets.filter(
      (bullet) => bullet.shooter !== Player.name
    );

    const closestEnemyBullet = enemyBullets.reduce(
      (prev, curr) => {
        const distance = Math.sqrt(
          Math.pow(Player.x - curr.x, 2) + Math.pow(Player.y - curr.y, 2)
        );
        if (distance < prev.distance) {
          return {
            distance: distance,
            bullet: curr,
          };
        }
        return prev;
      },
      { distance: Infinity }
    );

    if (closestEnemyBullet?.bullet && closestEnemyBullet.distance < 200) {
      Player.move(
        closestEnemyBullet.bullet.direction.x > 0 ? 1 : -1,
        closestEnemyBullet.bullet.direction.y > 0 ? -1 : 1
      );
    } else {
      Player.move(Player.x > 375 ? -1 : 1, Player.y > 375 ? -1 : 1);
    }
  },
};

export default Player;
