class Preloader extends Phaser.Scene {
    constructor() {
        super("Preloader");
    }

    preload() {
        // 加载所有共享的资源

        // 背景图片
        this.load.image('menu_bg', 'assets/background1.png');
        this.load.image('tutorial_bg', 'assets/background1.png');
        this.load.image('gameover_bg', 'assets/background1.png');
        this.load.image('game_bg', 'assets/background1.png');
        this.load.image('platform', 'assets/platform.png');

        // 精灵图
        this.load.spritesheet('basketSheet', 'assets/basket-Sheet.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        // 水果、炸弹、石头、篮子、金币等
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

        // 加载音效
        this.load.audio('sfx-confirm', 'assets/sfx-confirm.wav');
        this.load.audio('sfx-escape', 'assets/sfx-escape.wav');
        this.load.audio('sfx-failure', 'assets/sfx-failure.wav');
        this.load.audio('sfx-selection', 'assets/sfx-selection.wav');
        this.load.audio('sfx-success', 'assets/sfx-success.wav');

        // 可选：加载进度条（这里不做示例）
    }

    create() {
        // 预加载完成后，启动 MainMenu 场景
        this.scene.start('MainMenu');
    }
}
