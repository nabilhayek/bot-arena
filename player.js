const Player = {
  name: 'Nabil',
  tick: function (Player, bots, bullets) {
    const enemies = bots.filter((bot) => bot.name !== Player.name);
    if (enemies.length < 1) return;

    console.log(bullets);
  },
};

export default Player;
