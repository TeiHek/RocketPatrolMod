class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
      // show menu text
      this.add.text(game.config.width/2, game.config.height/3 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/3, 'Move the mouse to aim & click to fire', menuConfig).setOrigin(0.5);
      menuConfig.backgroundColor = '#00FF00';
      menuConfig.color = '#000';
      this.add.text(game.config.width/2, game.config.height/3 + borderUISize + borderPadding, 'Single Player', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/3 + borderUISize*2 + borderPadding*2, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/3 + borderUISize*3 + borderPadding*3, 'Multiplayer', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/3 + borderUISize*4 + borderPadding*4, 'Press ↑ for Novice or ↓ for Expert', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/3 + borderUISize*5 + borderPadding*5, 'Highscore:' + highScore, menuConfig).setOrigin(0.5);
      // define keys
      keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
      keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
      keyUP =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
      keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000,
            multiplayer: false
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000,
            multiplayer: false
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
        // Multiplayer options
        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
          // easy mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000,
            multiplayer: true
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
          // hard mode
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000,
            multiplayer: true
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
    }
}