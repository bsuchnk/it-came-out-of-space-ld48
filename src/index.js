import Phaser from 'phaser';
import img_tiles from './assets/tiles.png';
import img_tiles_n from './assets/tiles_n.png';
import img_tree from './assets/tree.png';
import img_tree_n from './assets/tree_n.png';
import img_well from './assets/well.png';
import img_well_n from './assets/well_n.png';

import img_flower1 from './assets/flower1.png';
import img_flower1_n from './assets/flower1_n.png';
import img_flower2 from './assets/flower2.png';
import img_flower2_n from './assets/flower2_n.png';
import img_flower3 from './assets/flower3.png';
import img_flower3_n from './assets/flower3_n.png';
import img_blood1 from './assets/blood.png';
import img_blood1_n from './assets/blood_n.png';
import img_corpse1 from './assets/corpse1.png';
import img_corpse1_n from './assets/corpse1_n.png';

import img_bullet from './assets/bullet.png';
//import img_bullet_n from './assets/bullet_n.png';

import img_bunny from './assets/bunny.png';
import img_bunny_n from './assets/bunny_n.png';
import img_imar from './assets/imar_ssheet.png';
import img_imar_n from './assets/imar_ssheet_n.png';
import img_lifebar from './assets/lifebar.png';

import img_fire from './assets/fire.png';
import img_bubble from './assets/bubble.png';

import map1 from './assets/map1.json';
import map2 from './assets/map2.json';
import map_tut from './assets/map_tut.json';
import map_o1 from './assets/map_o1.json';
import map_o2 from './assets/map_o2.json';
import map_o3 from './assets/map_o3.json';
import map_end from './assets/map_end.json';

import music_dark from './assets/sound/dark.mp3';

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

        this.v = 200;
        this.bulletAmount = 10;
        this.fired = false;
        this.lives = 5;
        this.showLifebarCount = 120;

        this.body.setCollideWorldBounds(true);
        this.body.setSize(20 ,16);
        this.body.setOffset((this.displayWidth-20)/2, this.displayHeight-16);

        this.setDepth(y);
        this.scene.cameras.main.startFollow(this);

        this.light = this.scene.lights.addLight(x, y, 200);

        this.going = false;

        this.lifebar = this.scene.add.sprite(scene, x, y-32, 'lifebar');
        this.showLifebar();

        this.finished = false;
    }

    finish() {
        this.finished = true;
        this.body.setVelocity(0, 0);
        this.body.setImmovable(true);
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

        this.lifebar.x = this.x;
        this.lifebar.y = this.y - 28;
        if (this.showLifebarCount > 0) {
            this.showLifebarCount--;
            if (this.showLifebarCount == 0) {
                this.lifebar.visible = false;
            }
        }
    }

    fire() {
        if (this.fired)
            return;

        this.fired = true;
        this.bulletAmount--;

        let bullet = new Bullet(this.scene, this.x, this.y, 'bullet', this.dir)
        this.scene.bullets.add(bullet);
        bullet.init();
    }

    unfire() {
        this.fired = false;
    }

    takeDamage() {
        if (this.finished) {
            return;
        }
        this.lives--;
        if (this.lives <= 0) {
            this.die();
        }

        this.showLifebarCount = 60;
        this.showLifebar();
    }

    die() {
        this.scene.restartLevel();
    }

    revive() {
        this.lives = 3;
        this.showLifebarCount = 120;
        this.showLifebar();
    }

    showLifebar() {
        if (this.finished) {
            return;
        }
        this.lifebar.visible = true;
        switch(this.lives) {
            case 1:
                this.lifebar.play('lifebar1', true);
                break;
            case 2:
                this.lifebar.play('lifebar2', true);
                break;
            case 3:
                this.lifebar.play('lifebar3', true);
                break;
            case 4:
                this.lifebar.play('lifebar4', true);
                break;
            case 5:
                this.lifebar.play('lifebar5', true);
                break;
        }
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

        this.particle = this.scene.add.particles('fire');
        this.particle.setDepth(this.y + 16);
        this.emitter = this.particle.createEmitter({
            alpha: { start: 0.5, end: 0 },
            scale: { start: 1, end: 2 },
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

    destroy() {
        this.scene.lights.removeLight(this.light);
        this.particle.destroy();
    }
}

class Well extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        this.body.setCollideWorldBounds(true);
        this.setPipeline('Light2D');
        
        this.setDepth(this.y + this.displayHeight/2);
    }

    init() {
        this.body.setImmovable(true);
    }
}

class Creature extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.scene = scene;

        this.body.setCollideWorldBounds(true);
        //this.setPipeline('Light2D');

        this.setDepth(this.y + this.displayHeight/2);

        this.light = this.scene.lights.addLight(x, y, 64);
        this.light.setColor(0xff00ff);
        this.light.setIntensity(0.25);
    }

    init() {
        //this.body.setImmovable(true);
        this.body.setVelocityX(2);
        this.play('bunny_right', true);
    }

    update() {
        this.light.x = this.x;
        this.light.y = this.y;

        let d = Phaser.Math.Distance.Squared(this.body.x, this.body.y, this.scene.player.x, this.scene.player.y);
        if (d <= 300*300) {
            let angle = Phaser.Math.Angle.Between(this.body.x, this.body.y, this.scene.player.x, this.scene.player.y);
            this.scene.physics.velocityFromRotation(angle, 150, this.body.velocity);
            if (this.body.velocity.x >= 0) {
                this.play('bunny_right', true);
            } else {
                this.play('bunny_left', true);
            }
        } else {
            if (this.body.velocity.x > 0) {
                this.play('bunny_sit_right', true);
            } else if (this.body.velocity.x < 0) {
                this.play('bunny_sit_left', true);
            }
            this.body.setVelocity(0, 0);
        }

        this.setDepth(this.y+this.displayHeight/2);
    }

    die() {
        this.scene.lights.removeLight(this.light);
    }
}

class Bullet extends Entity {
    constructor(scene, x, y, key, dir) {
        super(scene, x, y, key);
        this.dir = dir;

        this.body.setCollideWorldBounds(true);
        this.setPipeline('Light2D');

        this.setDepth(this.y + this.displayHeight/2);
    }

    init() {
        if (this.dir == this.dirEnum.RIGHT) {
            this.body.setVelocityX(500);
        } else {
            this.body.setVelocityX(-500);
        }
    }
}

class Glow {
    constructor(scene, x, y, r, intensity) {
        this.scene = scene;
        this.light = scene.lights.addLight(x, y, r, 0xff00ff, intensity);
    }

    destroy() {
        this.scene.lights.removeLight(this.light);
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
        this.load.image('bullet', img_bullet);
        
        this.load.image('fire', img_fire);
        this.load.image('bubble', img_bubble);

        this.load.spritesheet('imar', [img_imar, img_imar_n], {frameWidth: 32, frameHeight: 48});
        this.load.spritesheet('bunny', [img_bunny, img_bunny_n], {frameWidth: 48, frameHeight: 33});
        this.load.spritesheet('lifebar', img_lifebar, {frameWidth: 32, frameHeight: 8});

        this.load.tilemapTiledJSON('map1', map1);
        this.load.tilemapTiledJSON('map2', map2);
        this.load.tilemapTiledJSON('map_tut', map_tut);
        this.load.tilemapTiledJSON('map_o1', map_o1);
        this.load.tilemapTiledJSON('map_o2', map_o2);
        this.load.tilemapTiledJSON('map_o3', map_o3);
        this.load.tilemapTiledJSON('map_end', map_end);

        this.load.audio('music', music_dark);
    }
      
    create()
    {
        this.createAnimations();

        this.decorations = this.add.group();
        this.trees = this.physics.add.group();
        this.creatures = this.physics.add.group();
        this.bullets = this.physics.add.group();

        this.player = new Player(this, 300, 300, 'imar');

        this.colliderTrees = this.physics.add.collider(this.player, this.trees);
        this.colliderBuCr = this.physics.add.collider(this.bullets, this.creatures, (bu,cr) => {
            this.expl_emitter.explode(6, cr.x, cr.y);
            bu.destroy();
            cr.die();
            cr.destroy();
        });
        this.colliderPlCr = this.physics.add.collider(this.player, this.creatures, (pl, cr) => {
            console.log('bum');
            cr.die();
            cr.destroy();
            pl.takeDamage();
        });
        this.colliderWell = null;
        this.colliderCrCr = this.physics.add.collider(this.creatures, this.creatures);
        this.colliderPlMap = null;
        this.colliderCrMap = null;
        this.colliderBuMap = null;
        this.colliderCrTrees = this.physics.add.collider(this.creatures, this.trees);

        this.expl_particles = this.add.particles('fire');
        this.expl_emitter = this.expl_particles.createEmitter({
            alpha: { start: 0.2, end: 0 },
            scale: { start: 0.5, end: 1 },
            speed: { min: 10, max: 50 },
            repeat: -1,
            rotate: { min: -180, max: 180 },
            lifespan: { min: 300, max: 400 },
            blendMode: 'ADD',
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Circle(0, 0, 8),
            },
            on: false,
        });

        this.lights.enable().setAmbientColor(0x555555);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //
        this.fireplaces = [];
        this.glows = [];
        this.well = null;

        this.maps = ['map_tut', 'map_o1', 'map_o2', 'map_o3', 'map_end'];
        this.level = 0;

        this.bcg_music = this.sound.add('music');
        this.bcg_music.setLoop(true);
        this.bcg_music.play();
        
        this.fin = false;
        this.initLevel();
    }

    initLevel() {
        this.map = this.make.tilemap({key: this.maps[this.level]});
        let tiles = this.map.addTilesetImage('tiles', 'tiles');
        this.layer = this.map.createLayer(0, tiles, 0, 0);
        this.layer.setCollisionByProperty({ collide: true });
        this.layer.setPipeline('Light2D');
        this.layer.setDepth(-100);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.colliderPlMap = this.physics.add.collider(this.player, this.layer);
        this.colliderCrMap = this.physics.add.collider(this.creatures, this.layer);
        this.colliderBuMap = this.physics.add.collider(this.bullets, this.layer, (bu, la) => {
            this.expl_emitter.explode(6, bu.x, bu.y);
            bu.destroy();
        });

        this.loadScene();
    }

    destroyLevel() {
        this.trees.children.each(x=>x.destroy());
        this.decorations.children.each(x=>x.destroy());
        this.creatures.children.each(x=>{x.die(); x.destroy();});
        this.bullets.children.each(x=>{x.destroy();});
        this.layer.destroy();
        this.map.destroy();
        this.colliderPlMap.destroy();
        this.colliderCrMap.destroy();
        this.colliderBuMap.destroy();

        for (let x of this.fireplaces) {
            x.destroy();
        }
        this.fireplaces = [];
        for (let x of this.glows) {
            x.destroy();
        }
        this.glows = [];

        if (this.well != null) {
            this.well.destroy();
        }
        if (this.colliderWell != null) {
            this.colliderWell.destroy();
        }
    }

    restartLevel() {
        this.destroyLevel();
        this.initLevel();
        this.player.revive();
    }

    nextLevel() {
        
        this.level++;
        if (this.level < this.maps.length) {
            this.destroyLevel();
            this.initLevel();
        } else {
            this.finishGame();
        }
    }

    update() {
        if (!this.fin) {
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

            if (this.spaceKey.isDown) {
                this.player.fire();
            } else {
                this.player.unfire();
            }
            
            this.player.update();
        }

        this.creatures.children.each(x=>x.update());
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
            this.decorations.add(new Decoration(this, obj.x, obj.y, 'corpse1', false));
        });
        this.map.filterObjects('fireplaces', (obj) => {
            this.fireplaces.push(new Fire(this, obj.x, obj.y));
        });
        this.map.filterObjects('glows', (obj) => {
            let r, intensity;
            for (let p of obj.properties) {
                if (p.name == 'r')
                    r = p.value;
                if (p.name == 'intensity')
                    intensity = p.value;
            }
            this.glows.push(new Glow(this, obj.x, obj.y, r, intensity));
        });
        this.map.filterObjects('well', (obj) => {
            this.well = new Decoration(this, obj.x, obj.y, 'well', false);
            this.colliderWell = this.physics.add.collider(this.player, this.well, (player, well) => {
                this.nextLevel();
            }, null, this);
        });
        this.map.filterObjects('creatures', (obj) => {
            let creature = new Creature(this, obj.x, obj.y, 'bunny');
            this.creatures.add(creature);
            creature.init();
        });
        this.map.filterObjects('player', (obj) => {
            this.player.x = obj.x;
            this.player.y = obj.y;
        });
    }

    finishGame() {
        this.fin = true;
        this.player.finish();

        this.cameras.main.stopFollow();
        this.cameras.main.startFollow(this.well);

        this.cameras.main.shake(500, 0.02);

        this.bubble = this.add.particles('bubble');
        for (let i=0; i<3; i++) {
            this.bubble.createEmitter({
                x: this.well.x,
                y: this.well.y,
                scale: {min: 0.5, max: 1.5},
                alpha: {min: 0.1, max: 1},
                speed: {min: 500, max: 1000},
                angle: 270,
                blendMode: 'ADD',
                emitZone: {
                    type: 'random',
                    source: new Phaser.Geom.Circle(0, 0, 32),
                },
                lifespan: 500,
            });
        }

        this.well.destroy();
        this.player.visible = false;
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

        this.anims.create({
            key: 'bunny_right',
            frames: this.anims.generateFrameNumbers('bunny', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'bunny_sit_right',
            frames: this.anims.generateFrameNumbers('bunny', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 1
        });
        this.anims.create({
            key: 'bunny_left',
            frames: this.anims.generateFrameNumbers('bunny', { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'bunny_sit_left',
            frames: this.anims.generateFrameNumbers('bunny', { start: 2, end: 2 }),
            frameRate: 1,
            repeat: 1
        });

        this.anims.create({
            key: 'lifebar1',
            frames: this.anims.generateFrameNumbers('lifebar', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 1
        });
        this.anims.create({
            key: 'lifebar2',
            frames: this.anims.generateFrameNumbers('lifebar', { start: 1, end: 1 }),
            frameRate: 1,
            repeat: 1
        });
        this.anims.create({
            key: 'lifebar3',
            frames: this.anims.generateFrameNumbers('lifebar', { start: 2, end: 2 }),
            frameRate: 1,
            repeat: 1
        });
        this.anims.create({
            key: 'lifebar4',
            frames: this.anims.generateFrameNumbers('lifebar', { start: 3, end: 3 }),
            frameRate: 1,
            repeat: 1
        });
        this.anims.create({
            key: 'lifebar5',
            frames: this.anims.generateFrameNumbers('lifebar', { start: 4, end: 4 }),
            frameRate: 1,
            repeat: 1
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
