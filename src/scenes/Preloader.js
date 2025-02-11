class Preloader extends Phaser.Scene {
    constructor() {
        super("Preloader");
    }

    preload() {
        this.load.image('menu_bg', 'assets/background1.png');
        this.load.image('tutorial_bg', 'assets/background1.png');
        this.load.image('gameover_bg', 'assets/background1.png');
        this.load.image('game_bg', 'assets/background1.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.spritesheet('basketSheet', 'assets/basket-Sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('apple', 'assets/apple.png');
        this.load.image('banana', 'assets/banana.png');
        this.load.image('orange', 'assets/orange.png');
        this.load.image('watermelon', 'assets/watermelon.png');
        this.load.image('strawberry', 'assets/strawberry.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('stone', 'assets/falling stone.png');
        this.load.image('extraBasket', 'assets/basket.png');
        this.load.image('coin', 'assets/coin.png');
        this.load.image('leaf', 'assets/leaf.png');
        this.load.audio('sfx-confirm', 'assets/sfx-confirm.wav');
        this.load.audio('sfx-escape', 'assets/sfx-escape.wav');
        this.load.audio('sfx-failure', 'assets/sfx-failure.wav');
        this.load.audio('sfx-selection', 'assets/sfx-selection.wav');
        this.load.audio('sfx-success', 'assets/sfx-success.wav');
        this.load.audio('sfx-explosion', 'assets/sfx-explosion.wav');
        this.load.audio('sfx-hit', 'assets/sfx-hit.wav');
        this.load.audio('sfx-on', 'assets/sfx-on.wav');
        this.load.audio('sfx-off', 'assets/sfx-off.wav');
        this.load.audio('bgm', 'assets/bgm.wav');
    }

    create() {
        this.scene.start("MainMenu");
    }
}
