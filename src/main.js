let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
}

let game = new Phaser.Game(config);
// Set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
// Reserve keyboard vars
let keySPACE, keyR, keyLEFT, keyRIGHT;
