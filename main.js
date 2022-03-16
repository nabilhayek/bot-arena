const arena = document.getElementById('arena');
const ctx = arena.getContext('2d');
const FPS = 60;

let bullets = [];
let bots = {};

//javascript clamp value
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

class Bullet {
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
    //check collision with bots everyone exept the shooter
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

class Bot {
  constructor(x, y, name, hp = 100) {
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.name = name;
    this.hp = hp;
    this.lastShot = null;
    this.reloadTime = 500;
    this.radius = 20;
    this.image = new Image();
    this.image.src = `https://robohash.org/${this.name}.png?set=set2&size=80x80&bgset=bg2`;
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

  move(x, y) {
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

window.onload = () => {
  bots = {
    bot1: new Bot(arena.width / 2, arena.height / 2, 'bot1'),
    bot2: new Bot(arena.width / 3, arena.height / 3, 'bot2'),
    bot3: new Bot(arena.width / 4, arena.height / 4, 'bot3'),
  };

  setInterval(() => {
    bots['bot1'].shoot(bots['bot2'].x, bots['bot2'].y);
  }, 10);

  const tick = setInterval(() => {
    ctx.fillStyle = '#DDD';
    ctx.fillRect(0, 0, arena.width, arena.height);

    bots['bot2'].move(1, 0.2);
    bots['bot3'].move(1, 0.5);

    //render all bullets
    bullets.forEach((bullet) => {
      bullet.draw();
      bullet.update();
    });

    //draw all bots
    Object.values(bots).forEach((bot) => {
      bot.draw();
    });
  }, 1000 / FPS);
};
