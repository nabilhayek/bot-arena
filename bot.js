import { ctx, arena } from './main.js';
import Bullet, { bullets } from './bullet.js';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default class Bot {
  constructor(name, tick) {
    this.x = Math.floor(Math.random() * 750);
    this.y = Math.floor(Math.random() * 750);
    this.speed = 2;
    this.slowFactor = 1;
    this.name = name;
    this.hp = 100;
    this.lastShot = null;
    this.reloadTime = 500;
    this.radius = 20;
    this.image = new Image();
    this.image.src = './images/bot.png';
    this.tick = tick;
  }

  get reloading() {
    return (
      this.lastShot !== null && Date.now() - this.lastShot < this.reloadTime
    );
  }

  get pos() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  get health() {
    return this.hp;
  }

  destroy() {
    delete bots[this.name];
  }

  angleTo(target) {
    const x = target.x - this.x;
    const y = target.y - this.y;
    const angle = Math.atan2(y, x);
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
  }

  shoot(x, y) {
    if (!this.reloading) {
      const direction = this.angleTo({ x, y });
      bullets.push(new Bullet(this.x, this.y, direction, this.name));
      this.lastShot = Date.now();
    }
  }

  update() {
    this.slowFactor = 1;
    for (let bot in bots) {
      if (bot !== this.name) {
        const distance = Math.sqrt(
          Math.pow(this.x - bots[bot].x, 2) + Math.pow(this.y - bots[bot].y, 2)
        );
        if (distance < this.radius * 2) {
          this.slowFactor = 0.5;
          const angle = Math.atan2(bots[bot].y - this.y, bots[bot].x - this.x);
          this.x -= Math.cos(angle) * this.speed * this.slowFactor;
          this.y -= Math.sin(angle) * this.speed * this.slowFactor;
        }
      }
    }
    this.tick(
      this,
      Object.entries(bots).map((bot) => bot[1]),
      bullets
    );
  }

  move(x, y) {
    //cant move to position if theres a bot there
    for (let bot in bots) {
      if (bot !== this.name) {
        const distance = Math.sqrt(
          Math.pow(this.x - bots[bot].x, 2) + Math.pow(this.y - bots[bot].y, 2)
        );
        if (distance < this.radius * 2) {
          return;
        }
      }
    }

    x = clamp(x, -1, 1);
    y = clamp(y, -1, 1);
    const magnitude = Math.sqrt(x * x + y * y);
    if (magnitude > 0) {
      this.x = clamp(
        this.x + x * (this.speed / magnitude),
        this.radius,
        arena.width - this.radius
      );
      this.y = clamp(
        this.y + y * (this.speed / magnitude),
        this.radius * 2,
        arena.height - this.radius * 2 + this.radius / (3 * 2)
      );
    }
  }

  draw() {
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, this.x, this.y - this.radius * 1.5);

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = '#DDD';
    ctx.shadowColor = '#00000025';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.save();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.drawImage(
      this.image,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
    ctx.restore();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(
      this.x - this.radius,
      this.y + this.radius * 1.5,
      this.radius * 2,
      this.radius / 3
    );
    ctx.fillStyle = '#BBB';
    ctx.shadowColor = '#00000030';
    ctx.shadowBlur = 5;
    ctx.fill();
    ctx.closePath();

    // draw hp bar
    const hpUnitWidth = (this.radius * 2) / 100;
    ctx.beginPath();
    ctx.rect(
      this.x - this.radius,
      this.y + this.radius * 1.5,
      hpUnitWidth * this.hp,
      this.radius / 3
    );
    ctx.fillStyle = '#f43a3a';
    ctx.fill();
    ctx.closePath();
  }
}

import Player from './player.js';
import Matheus from './matheus.js';
import Abbe from './abbe.js';
import Jakob from './jakob.js';

function shuffleObject(obj) {
  // new obj to return
  let newObj = {};
  // create keys array
  var keys = Object.keys(obj);
  // randomize keys array
  keys.sort(function (a, b) {
    return Math.random() - 0.5;
  });
  // save in new array
  keys.forEach(function (k) {
    newObj[k] = obj[k];
  });
  return newObj;
}

//scramble bots
export let bots = shuffleObject({
  [Player.name]: new Bot(Player.name, Player.tick),
  [Matheus.name]: new Bot(Matheus.name, Matheus.tick),
  [Abbe.name]: new Bot(Abbe.name, Abbe.tick),
  [Jakob.name]: new Bot(Jakob.name, Jakob.tick),
});
