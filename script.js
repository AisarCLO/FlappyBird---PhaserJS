let platforms;
let player;
let cursors;
let gameOver = false;

class Flappy extends Phaser.Scene {
  preload() {
    this.load.image("bg-day", "flappy-bird-assets-master/sprites/bg-day.png");
    this.load.image("base", "flappy-bird-assets-master/sprites/base.png");
    this.load.image(
      "upBird",
      "flappy-bird-assets-master/sprites/bluebird-upflap.png"
    );
    this.load.image(
      "midBird",
      "flappy-bird-assets-master/sprites/bluebird-midflap.png"
    );
    this.load.image(
      "downBird",
      "flappy-bird-assets-master/sprites/bluebird-downflap.png"
    );
    this.load.image(
      "gameOver",
      "flappy-bird-assets-master/sprites/gameover.png"
    );
    this.load.image("pipe", "flappy-bird-assets-master/sprites/pipe-green.png");
  }

  create() {
    this.add.image(0, 0, "bg-day").setOrigin(0, 0);
    platforms = this.physics.add.staticGroup();
    const base = platforms.create(0, 680, "base");
    base.setScale(8, 1);
    base.refreshBody();

    player = this.physics.add.sprite(100, 450, "upBird");
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "flap",
      frames: [{ key: "upBird" }, { key: "midBird" }, { key: "downBird" }],
      frameRate: 10,
      repeat: -1,
    });

    player.play("flap");
    this.physics.add.collider(player, platforms);
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on("keydown-SPACE", this.jump, this);

    this.pipes = this.physics.add.group(); // Create an empty group for pipes
    this.timer = this.time.addEvent({
      delay: 1500,
      callback: this.addPipes,
      callbackScope: this,
      loop: true,
    });
  }

  jump() {
    if (!gameOver) {
      player.setVelocityY(-300);
    }
  }

  update() {
    if (gameOver) {
      this.add.image(550, 350, "gameOver").setOrigin(0.5, 0.5);
      return;
    }

    player.setVelocityY(player.body.velocity.y + 7);

    if (player.y >= 610) {
      this.gameOver();
    }
  }

  addPipes() {
    this.addOnePipe(1100, game.config.height - 8); // Bottom pipe - Pair 1
    this.addOnePipe(1100, 0); // Top pipe - Pair 1

    // Add another pair of pipes
    this.addOnePipe(1400, game.config.height - 8); // Bottom pipe - Pair 2
    this.addOnePipe(1400, 0); // Top pipe - Pair 2
  }

  addOnePipe(x, y) {
    const pipeHeight = this.textures.get("pipe").getSourceImage().height;

    const pipe = this.physics.add.sprite(x, y, "pipe");

    this.pipes.add(pipe);
    this.physics.world.enable(pipe);
    pipe.body.allowGravity = false;
    pipe.body.velocity.x = -200;
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;

    // Rotate the top pipe by 180 degrees
    if (y === 0) {
      pipe.setAngle(180);
    }
  }

  gameOver() {
    console.log("Game Over!");
    gameOver = true;
    player.anims.stop();
    this.add.image(550, 350, "gameOver").setOrigin(0.5, 0.5);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1100,
  height: 700,
  scene: Flappy,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
