import Phaser from 'phaser';
import img_tiles from './assets/tiles.png';
import img_tiles_n from './assets/tiles_n.png';
import img_tree from './assets/tree.png';
import img_tree_n from './assets/tree_n.png';
import img_well from './assets/well.png';
import img_well_n from './assets/well_n.png';
import img_player from './assets/imar.png';

import img_flower1 from './assets/flower1.png';
import img_flower1_n from './assets/flower1_n.png';
import img_flower2 from './assets/flower2.png';
import img_flower2_n from './assets/flower2_n.png';
import img_flower3 from './assets/flower3.png';
import img_flower3_n from './assets/flower3_n.png';
import img_imar from './assets/imar_ssheet.png';
import img_imar_n from './assets/imar_ssheet_n.png';
import img_blood1 from './assets/blood.png';
import img_blood1_n from './assets/blood_n.png';
import img_corpse1 from './assets/corpse1.png';
import img_corpse1_n from './assets/corpse1_n.png';
import img_fire from './assets/fire.png';

import map1 from './assets/map1.json';
import map2 from './assets/map2.json';

class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this.setPipeline('Light2D');

        this.dirEnum = {
            LEFT: 'left',
            RIGHT: 'right'
        }
        this.dir = this.dirEnum.RIGHT;
    }
}

class Player extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        this.body.setCollideWorldBounds(true);
        this.body.setSize(20 ,16);
        this.body.setOffset((this.displayWidth-20)/2, this.displayHeight-16);

        this.setDepth(y);
        this.scene.cameras.main.startFollow(this);

        this.v = 200;

        this.light = this.scene.lights.addLight(x, y, 200);

        this.going = false;
    }

    goUp() {
        this.body.setVelocityY(-this.v);
        this.going = true;
    }
    goDown() {
        this.body.setVelocityY(this.v);
        this.going = true;
    }
    goLeft() {
        this.body.setVelocityX(-this.v);
        this.dir = this.dirEnum.LEFT;
        this.going = true;
    }
    goRight() {
        this.body.setVelocityX(this.v);
        this.dir = this.dirEnum.RIGHT;
        this.going = true;
    }
    stayX() {
        this.body.setVelocityX(0);
    }
    stayY() {
        this.body.setVelocityY(0);
    }

    update() {
        this.light.x = this.x;
        this.light.y = this.y;

        this.setDepth(this.y + this.displayHeight/2)

        if (this.going) {
            if (this.dir == this.dirEnum.LEFT) {
                this.play('walk_left', true);
            } else {
                this.play('walk_right', true);
            }
        } else {
            if (this.dir == this.dirEnum.LEFT) {
                this.play('stay_left', true);
            } else {
                this.play('stay_right', true);
            }
        }
        this.going = false;
    }
}

class Tree extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        this.body.setCollideWorldBounds(true);
        this.setPipeline('Light2D');
        
        this.body.setSize(24, 24);
        this.body.setOffset((this.displayWidth-24)/2, this.displayHeight-24);

        this.setDepth(this.y + this.displayHeight/2);
    }

    init() {
        this.body.setImmovable(true);
    }
}

class Decoration extends Entity {
    constructor(scene, x, y, key, under) {
        super(scene, x, y, key);

        this.setPipeline('Light2D');

        this.setDepth(this.y + this.displayHeight/2);
        if (under) {
            this.setDepth(-1);
        }
    }
}

class Fire {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.scene.fire_particles.createEmitter({
            alpha: { start: 0.5, end: 0 },
            scale: { start: 1, end: 2 },
            //tint: { start: 0xff945e, end: 0xff945e },
            repeat: -1,
            speed: 32,
            accelerationY: -24,
            angle: { min: -85, max: -95 },
            rotate: { min: -180, max: 180 },
            lifespan: { min: 700, max: 1000 },
            blendMode: 'ADD',
            frequency: 120,
            maxParticles: 10,
            x: this.x,
            y: this.y
        });

        this.light = this.scene.lights.addLight(this.x, this.y, 175);
        this.light.setColor(0xe25822).setIntensity(1.5);
    }
}

class Well extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        this.body.setCollideWorldBounds(true);
        this.setPipeline('Light2D');
        
        //this.body.setSize(24, 24);
        //this.body.setOffset((this.displayWidth-24)/2, this.displayHeight-24);

        this.setDepth(this.y + this.displayHeight/2);
    }

    init() {
        this.body.setImmovable(true);
    }
}

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload()
    {
        this.load.image('tiles', [img_tiles, img_tiles_n]);
        this.load.image('well', [img_well, img_well_n]);
        this.load.image('tree', [img_tree, img_tree_n]);
        this.load.image('flower1', [img_flower1, img_flower1_n]);
        this.load.image('flower2', [img_flower2, img_flower2_n]);
        this.load.image('flower3', [img_flower3, img_flower3_n]);
        this.load.image('blood1', [img_blood1, img_blood1_n]);
        this.load.image('corpse1', [img_corpse1, img_corpse1_n]);
        this.load.image('player', img_player);
        this.load.image('fire', img_fire);

        this.load.spritesheet('imar', [img_imar, img_imar_n], {frameWidth: 32, frameHeight: 48});

        this.load.tilemapTiledJSON('map1', map1);
        this.load.tilemapTiledJSON('map2', map2);
    }
      
    create()
    {
        this.createAnimations();


        this.decorations = this.add.group();
        this.trees = this.physics.add.group();

        this.player = new Player(this, 300, 300, 'imar');

        this.colliderTrees = this.physics.add.collider(this.player, this.trees);

        this.lights.enable().setAmbientColor(0x555555);

        this.cursors = this.input.keyboard.createCursorKeys();

        //
        //let light = this.lights.addLight(500, 500, 5000);
        //light.setColor(0xff00ff).setIntensity(20.0);

        //let light = this.lights.addLight(500, 500, 300);
        //light.setColor(0xff00ff).setIntensity(5.0);

        //
        // this.fire_particles = this.add.particles('fire');
        // this.fireplaces = [];
        // this.fireplaces.push(new Fire(this, 400, 300));

        this.colliderWell = null;

        this.well = null;

        this.maps = ['map1', 'map2'];
        this.level = 0;

        this.initLevel();
        //this.loadScene();

        //this.nextLevel();
    }

    initLevel() {
        this.map = this.make.tilemap({key: this.maps[this.level]});
        console.log(this.map);
        let tiles = this.map.addTilesetImage('tiles', 'tiles');
        this.layer = this.map.createLayer(0, tiles, 0, 0);
        this.layer.setPipeline('Light2D');
        this.layer.setDepth(-100);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.loadScene();
    }

    destroyLevel() {
        this.trees.children.each(x=>x.destroy());
        this.decorations.children.each(x=>x.destroy());
        this.layer.destroy();
        this.map.destroy();
        if (this.well != null) {
            this.well.destroy();
            this.colliderWell.destroy();
        }
    }

    restartLevel() {
        this.destroyLevel();
        this.initLevel();
    }

    nextLevel() {
        this.destroyLevel();
        this.level++;
        this.initLevel();
    }

    update() {
        if (this.cursors.left.isDown && !this.cursors.right.isDown) {
            this.player.goLeft();
        } else if (this.cursors.right.isDown && !this.cursors.left.isDown) {
            this.player.goRight();
        } else {
            this.player.stayX();
        }
        if (this.cursors.up.isDown && !this.cursors.down.isDown) {
            this.player.goUp();
        } else if (this.cursors.down.isDown && !this.cursors.up.isDown) {
            this.player.goDown();
        } else {
            this.player.stayY();
        }
        this.player.update();
    }

    loadScene() {
        this.map.filterObjects('trees', (obj) => {
                let tree = new Tree(this, obj.x, obj.y, 'tree')
                this.trees.add(tree);
                tree.init();
        });
        this.map.filterObjects('flower1', (obj) => {
            this.decorations.add(new Decoration(this, obj.x, obj.y, 'flower1', false));
        });
        this.map.filterObjects('flower2', (obj) => {
            this.decorations.add(new Decoration(this, obj.x, obj.y, 'flower2', false));
        });
        this.map.filterObjects('flower3', (obj) => {
            this.decorations.add(new Decoration(this, obj.x, obj.y, 'flower3', false));
        });
        this.map.filterObjects('blood', (obj) => {
            this.decorations.add(new Decoration(this, obj.x, obj.y, 'blood1', true));
        });
        this.map.filterObjects('corpses', (obj) => {
            this.decorations.add(new Decoration(this, obj.x, obj.y, 'corpse1', false)); // zmienic na przeszkode
        });
        this.map.filterObjects('well', (obj) => {
            this.well = new Decoration(this, obj.x, obj.y, 'well', false);
            this.colliderWell = this.physics.add.collider(this.player, this.well, (player, well) => {
                this.nextLevel();
            }, null, this);
        });
    }

    createAnimations() {
        this.anims.create({
            key: 'stay_right',
            frames: this.anims.generateFrameNumbers('imar', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'stay_left',
            frames: this.anims.generateFrameNumbers('imar', { start: 2, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'walk_right',
            frames: this.anims.generateFrameNumbers('imar', { start: 4, end: 5 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'walk_left',
            frames: this.anims.generateFrameNumbers('imar', { start: 6, end: 7 }),
            frameRate: 6,
            repeat: -1
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
        }
    },
    scene: MyGame,
};

const game = new Phaser.Game(config);
