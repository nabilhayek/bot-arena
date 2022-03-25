function getDistance(a, b) {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}
const Player = {
  name: 'Matheus',
  tick: function (Player, bots, bullets) {
    const enemies = bots.filter((bot) => bot.name !== Player.name);
    if (enemies.length < 1 || bullets.length < 1) return;
    let nearestBullet = bullets[0];
    bullets.forEach((bullet) => {
      if (
        bullet.shooter !== Player.name &&
        getDistance(nearestBullet.x, nearestBullet.y) <
          getDistance(bullet.x, bullet.y)
      )
        nearestBullet = bullet;
    });
    let nearestPlayer = enemies[0];
    enemies.forEach((player) => {
      if (
        getDistance(nearestPlayer.x, nearestPlayer.y) >
        getDistance(player.x, player.y)
      )
        nearestPlayer = player;
    });
    Player.shoot(nearestPlayer.x, nearestPlayer.y);
    Player.move(
      nearestBullet.direction.x > 0 ? -1 : 1,
      nearestBullet.direction.y > 0 ? -1 : 1
    );
  },
};
export default Player;
