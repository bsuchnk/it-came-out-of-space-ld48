class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);

        this.dirEnum = {
            LEFT: 'left',
            RIGHT: 'right'
        }
        this.dir = this.dirEnum.RIGHT;
    }
}