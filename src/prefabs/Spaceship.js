// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, texture, frame, pointValue, timeBonus, speedMultiplier = 1) {
        super (scene, x, y, texture, frame);
        //this.setoffset(0,16);
        scene.add.existing(this);   // Add to existing scene
        this.points = pointValue;   // Store pointValue
        this.timeBonus = timeBonus
        this.moveSpeed = game.settings.spaceshipSpeed * speedMultiplier;
    }
    
    update() {
        // Move spaceship left
        this.x -= this.moveSpeed;
        // Wrap around from left edge to right edge
        if (this.x <= 0 - this.width) {
            this.reset();
        }
    }

    // Position reset
    reset() {
        this.x = game.config.width;
    }
}