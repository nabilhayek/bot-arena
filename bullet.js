import { ctx, arena } from './main.js';
import { bots } from './bot.js';
export let bullets = [];

export default class Bullet {
  constructor(x, y, direction, shooter) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.speed = 5;
    this.radius = 2.5;
    this.shooter = shooter;
    this.hasBounced = false;
  }

  draw() {
    //draw bullet circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();
  }

  destroy() {
    bullets.splice(bullets.indexOf(this), 1);
  }

  //bounce bullet off canvas wall with new direction.x and direction.y value
  bounce() {
    if (!this.hasBounced) {
      if (this.x < this.radius) {
        this.direction.x = -this.direction.x;
        this.hasBounced = true;
      }
      if (this.x > arena.width - this.radius) {
        this.direction.x = -this.direction.x;
        this.hasBounced = true;
      }
      if (this.y < this.radius * 2) {
        this.direction.y = -this.direction.y;
        this.hasBounced = true;
      }
      if (this.y > arena.height - this.radius * 2) {
        this.direction.y = -this.direction.y;
        this.hasBounced = true;
      }
    }
  }
  //check if bullet is colliding with bot
  checkCollision(bot) {
    const distance = Math.sqrt(
      Math.pow(this.x - bot.x, 2) + Math.pow(this.y - bot.y, 2)
    );
    if (distance < bot.radius + this.radius) {
      bot.hp -= 10;
      if (bot.hp <= 0) {
        bot.destroy();
      }
      this.destroy();
    }
  }

  update() {
    this.x += this.direction.x * this.speed;
    this.y += this.direction.y * this.speed;
    for (let bot in bots) {
      if (bot !== this.shooter) {
        this.checkCollision(bots[bot]);
      }
    }

    // check if bullet is touching wall, if havent bounced yet, bounce!
    this.bounce();

    //check if bullet is out of arena
    if (
      this.hasBounced &&
      (this.x < 0 - this.radius * 2 ||
        this.x > arena.width + this.radius * 2 ||
        this.y < 0 - this.radius * 2 ||
        this.y > arena.height + this.radius * 2)
    ) {
      this.destroy();
    }
  }
}
