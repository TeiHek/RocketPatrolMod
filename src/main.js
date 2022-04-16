/*
Randy Le
4/18/2022
Rocket Patrol Mods
Points Breakdown (and time estimate), In order of addition
10 - Display timer                            (30 mins)
20 - Adding points to clock for hitting ships (1 hr)
20 - Added smaller ship                       (1 hr programming, 1 hr artwork)
20 - Mouse controls                           (2 hrs)
20 - Alternating multiplayer                  (3 hrs)
5  - FIRE UI text                             (10 mins)
5  - High score, persists after scene change  (10 mins)
*/
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
let keySPACE, keyR, keyLEFT, keyRIGHT, pointer, keyUP, keyDOWN;
let highScore = 0;
