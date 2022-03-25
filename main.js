export const arena = document.getElementById('arena');
export const ctx = arena.getContext('2d');
const FPS = 60;

import { bots } from './bot.js';
import { bullets } from './bullet.js';

window.onload = () => {
  const tick = setInterval(() => {
    ctx.fillStyle = '#DDD';
    ctx.fillRect(0, 0, arena.width, arena.height);

    //render all bullets
    bullets.forEach((bullet) => {
      bullet.draw();
      bullet.update();
    });

    //draw all bots
    Object.values(bots).forEach((bot) => {
      bot.draw();
      bot.update();
    });
  }, 1000 / FPS);
};
