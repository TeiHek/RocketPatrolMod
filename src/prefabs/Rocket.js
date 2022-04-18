// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // Add object into existing scene
        scene.add.existing(this);   // Add to existing, displayList, updateList
        this.isFiring = false;      // Track rocket's firing status
        this.moveSpeed = 2;         // Pixels per frame
        // Add rocket sfx
        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
        // Firing
        scene.input.on('pointerdown',(pointer) => {
            this.isFiring = true;
            this.sfxRocket.play();  // Play sfx
        })
    }

    update() {
        // L/R Movement
        if (!this.isFiring) {
            if (pointer.worldX < this.x && this.x >= borderUISize) {
                this.x -= this.moveSpeed;
            } else if (pointer.worldX > this.x && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }

        // If fired, move up
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        // Reset on miss
        if (this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    // Reset rocket to "ground"
    reset() {
        this.isFiring = false;
            this.y = game.config.height - borderUISize - borderPadding;
    }
}