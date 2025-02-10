class Tutorial extends Phaser.Scene {
    constructor() {
        super("Tutorial");
    }
  
    // preload() {
    //     this.load.image('tutorial_bg', 'assets/background1.png');
    //     // 同样加载音效资源
    //     this.load.audio('sfx-confirm', 'assets/sfx-confirm.wav');
    //     this.load.audio('sfx-escape', 'assets/sfx-escape.wav');
    //     this.load.audio('sfx-failure', 'assets/sfx-failure.wav');
    //     this.load.audio('sfx-selection', 'assets/sfx-selection.wav');
    //     this.load.audio('sfx-success', 'assets/sfx-success.wav');
    // }
  
    create() {
        this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'tutorial_bg'
        )
        .setOrigin(0.5)
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  
        let tutorialStr = 
            "Instructions:\n" +
            "1. Move your mouse to control the basket's horizontal movement on the platform.\n" +
            "2. Click to open or close the basket (4-frame animation).\n" +
            "3. Falling objects are generated continuously at fixed intervals. As time passes, both their falling speed and density increase, and objects are spawned in a non-overlapping manner.\n" +
            "4. Bombs, stones, and extra baskets also fall. Contact with them will damage your basket, while extra baskets can increase your basket count (rare chance).\n" +
            "5. Missed fruits that pass through the platform will bounce and shrink away; missing 10 fruits will damage one basket. When all baskets are lost, the game is over.\n" +
            "6. Collect coins (magnet power-ups) up to a maximum of 5. Press the E key to activate the magnet, which attracts fruits from the lower half of the screen to your basket.";
  
        let textConfig = {
            fontFamily: 'Arial',
            fontSize: '26px',
            color: '#0000FF',
            align: 'left',
            wordWrap: { width: this.cameras.main.width - 80 }
        };
  
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 6,
            tutorialStr,
            textConfig
        ).setOrigin(0.5, 0);
  
        let btnConfig = {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#fff',
            backgroundColor: '#b58900',
            padding: { x: 20, y: 10 },
            align: 'center'
        };
        let startBtn = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 150,
            'GAME START',
            btnConfig
        ).setOrigin(0.5).setInteractive();
  
        startBtn.on('pointerover', () => {
            this.sound.play('sfx-selection');
            startBtn.setScale(1.05);
        });
        startBtn.on('pointerout', () => {
            startBtn.setScale(1);
        });
        startBtn.on('pointerdown', () => {
            this.sound.play('sfx-confirm');
            this.scene.start('Gameplay');
        });
    }
}
