class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
  }
  
  preload() {
    // load images/tile sprites
    this.load.image('rocket', './assets/rocket.png');
    this.load.image('spaceship', './assets/spaceship-mod.png');
    this.load.image('starfield', './assets/starfield.png');
    this.load.image('smallship', './assets/smallship.png');
    // load spritesheet
    this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    this.load.spritesheet('smallship-explosion', './assets/smallship-explosion.png', {frameWidth: 48, frameHeight: 22, startFrame: 0, endFrame: 7});
  }

  create() {
    // Place tile sprite
    this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
    // Green UI background
    this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
    // white borders
    this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
    this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
    this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
    this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
    // Add Rocket (P1)
    this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0, 0);
    // Set current player to P1's Rocket
    this.currentPlayer = this.p1Rocket;
    // add spaceships (x3)
    this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4 + borderPadding*2, 'spaceship', 0, 30, 3).setOrigin(0, 0);
    this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*3, 'spaceship', 0, 20, 2).setOrigin(0,0);
    this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10, 1).setOrigin(0,0);
    // add smallship (bonus point ship)
    this.ship04 = new Spaceship(this, game.config.width, borderUISize*3 + borderPadding*2, 'smallship', 0, 50, 5, 2).setOrigin(0,0);
    // Define keys
    //keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    pointer = this.input.activePointer;
    // animation config
    // Spaceship explosion
    this.anims.create({
    key: 'explode',
    frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
    frameRate: 30
    });
    // Smallship explosion
    this.anims.create({
      key: 'smallexplode',
      frames: this.anims.generateFrameNumbers('smallship-explosion', { start: 0, end: 7, first: 0}),
      frameRate: 30
    });
    // Multiplayer flag, if single player = false, if multi = false only on 2P
    this.swap = game.settings.multiplayer;
    // initialize score + time
    this.p1Score = 0;
    this.currentScore = this.p1Score
    this.timeRemaining = game.settings.gameTimer/1000;  // Time in seconds
    // display score
    let scoreConfig = {
      fontFamily: 'Courier',
      fontSize: '28px',
      backgroundColor: '#F3B141',
      color: '#843605',
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 100
    };
    this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
    this.scorePosition = this.scoreLeft;
    if(game.settings.multiplayer) {
      this.p2Score = 0;
      this.scoreRight = this.add.text(config.width/2 + borderUISize*6 - borderUISize/2, borderUISize + borderPadding*2, this.p2Score, scoreConfig);
    }
    // Game Timer
    let TimerConfig = {
      fontFamily: 'Courier',
      fontSize: '28px',
      backgroundColor: '#F3B141',
      color: '#843605',
      align: 'center',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 50
    };
    this.timerUI = this.add.text( game.config.width/2 - borderPadding*6, borderUISize + borderPadding*2, this.timeRemaining, TimerConfig);
    this.gameTimer = this.time.addEvent({ delay: 1000, callback: () => {
      if (this.timeRemaining > 0) {
        this.timeRemaining -= 1;
        this.timerUI.text = this.timeRemaining;
      } else {
        if(this.swap) {
          // Set game over state
          this.gameOver = true;
          // Check high score
          if(this.currentScore > highScore) highScore = this.currentScore;
          this.readyPlayer2();
        } else {
          // Check high score
          if(this.currentScore > highScore) highScore = this.currentScore;
          // Show game over text
          this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
          this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ??? for Menu', scoreConfig).setOrigin(0.5);
          this.gameOver = true;
        }
      }
    }, callbackScope: null, loop: true});
    // GAME OVER flag
    this.gameOver = false;
    scoreConfig.fixedWidth = 0;
    // Fire text
    this.fireUI = this.add.text( game.config.width/2 + borderPadding, borderUISize + borderPadding*2, "FIRE", scoreConfig);
  }
  
  update() {
    // Show FIRE text while able to fire
    this.fireUI.visible = this.currentPlayer.isFiring;
    // check key input for restart
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR) && !this.swap) {
      this.scene.restart();
    }
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT) && !this.swap) {
      this.scene.start("menuScene");
    }
    this.starfield.tilePositionX -= 4;
    if (!this.gameOver) {               
      this.currentPlayer.update();         // update rocket sprite
      this.ship01.update();           // update spaceships (x3)
      this.ship02.update();
      this.ship03.update();
      this.ship04.update();
    } 
    // check collisions
    if(this.checkCollision(this.currentPlayer, this.ship03)) {
      this.currentPlayer.reset();
      this.shipExplode(this.ship03, 'explode');
      this.timeRemaining += this.ship03.timeBonus;
      this.timerUI.text = this.timeRemaining;
    }
    if (this.checkCollision(this.currentPlayer, this.ship02)) {
      this.currentPlayer.reset();
      this.shipExplode(this.ship02, 'explode');
      this.timeRemaining += this.ship02.timeBonus;
      this.timerUI.text = this.timeRemaining;
    }
    if (this.checkCollision(this.currentPlayer, this.ship01)) {
      this.currentPlayer.reset();
      this.shipExplode(this.ship01, 'explode');
      this.timeRemaining += this.ship01.timeBonus;
      this.timerUI.text = this.timeRemaining;
    }
    if (this.checkCollision(this.currentPlayer, this.ship04)) {
      this.currentPlayer.reset();
      this.shipExplode(this.ship04, 'smallexplode');
      this.timeRemaining += this.ship04.timeBonus;
      this.timerUI.text = this.timeRemaining;
    }
  }

  checkCollision(rocket, ship) {
    // simple AABB checking
    if (rocket.x < ship.x + ship.width && 
        rocket.x + rocket.width > ship.x && 
        rocket.y < ship.y + ship.height &&
        rocket.height + rocket.y > ship.y) {
            return true;
    } else {
        return false;
    }
  }

  shipExplode(ship, anim) {
    // temporarily hide ship
    ship.alpha = 0;
    // create explosion sprite at ship's position
    let boom = this.add.sprite(ship.x, ship.y, anim).setOrigin(0, 0);
    boom.anims.play(anim);             // play explode animation
    boom.on('animationcomplete', () => {    // callback after anim completes
      ship.reset();                         // reset ship position
      ship.alpha = 1;                       // make ship visible again
      boom.destroy();                       // remove explosion sprite
    });
    // Score add and repaint
    this.currentScore += ship.points;
    this.scorePosition.text = this.currentScore;
    // Play explosion sfx
    this.sound.play('sfx_explosion');
  }

  readyPlayer2() {
    // Pause game timer
    this.gameTimer.paused = true
    // Reset ships
    this.ship01.x = game.config.width + borderUISize*6;
    this.ship02.x = game.config.width + borderUISize*3;
    this.ship03.x = game.config.width;
    this.ship04.x = game.config.width;
    //Track P2's score
    this.currentScore = this.p2Score;
    this.scorePosition = this.scoreRight;
    // Reset timer for P2
    this.timeRemaining = game.settings.gameTimer/1000;  // Time in seconds
    // Add p2 rocket
    this.p2Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0, 0);
    this.currentPlayer = this.p2Rocket
    // Destroy p1Rocket
    this.p1Rocket.destroy();
    // Prompt Player 2 ready
    let promptConfig = {
      fontFamily: 'Courier',
      fontSize: '28px',
      backgroundColor: '#F3B141',
      color: '#843605',
      align: 'center',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 275
    };
    this.p2Prompt = this.add.text(game.config.width/2, game.config.height/2, 'PLAYER 2 READY', promptConfig).setOrigin(0.5);
    let timer = this.time.delayedCall(3000, () => {
      // Destroy text prompt
      this.p2Prompt.destroy();
      // Revert game over state
      this.swap = false;
      this.gameOver = false;
      // Resume timer
      this.gameTimer.paused = false;
    }, null, this);
    
  }
}