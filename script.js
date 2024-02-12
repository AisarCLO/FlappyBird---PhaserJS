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
    // Pair 1
    const gapHeight = 150; // Adjust the gap height as needed
    const pipeGap = 200; // Adjust the overall gap between the top and bottom pipes
    const bottomPipeY1 = Phaser.Math.Between(
      100,
      game.config.height - gapHeight - 100
    );
    const topPipeY1 = bottomPipeY1 - gapHeight - pipeGap;

    this.addOnePipe(1100, bottomPipeY1); // Bottom pipe - Pair 1
    this.addOnePipe(1100, topPipeY1, true); // Top pipe - Pair 1

    // Pair 2 with a gap
    const bottomPipeY2 = Phaser.Math.Between(
      100,
      game.config.height - gapHeight - 100
    );
    const topPipeY2 = bottomPipeY2 - gapHeight - pipeGap;

    this.addOnePipe(1400, bottomPipeY2); // Bottom pipe - Pair 2
    this.addOnePipe(1400, topPipeY2, true); // Top pipe - Pair 2
  }

  addOnePipe(x, y, isTopPipe = false) {
    const pipeHeight = this.textures.get("pipe").getSourceImage().height;
    const adjustedY = isTopPipe ? y - pipeHeight : y;

    const pipe = this.physics.add.sprite(x, adjustedY, "pipe");

    this.pipes.add(pipe);
    this.physics.world.enable(pipe);
    pipe.body.allowGravity = false;
    pipe.body.velocity.x = -200;
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;

    // Rotate the top pipe by 180 degrees
    if (isTopPipe) {
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
