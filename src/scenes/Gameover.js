class Gameover extends Phaser.Scene {
    constructor() {
        super("Gameover");
    }
  
    init(data) {
        this.finalScore = data.score || 0;
        this.finalTime  = data.time || 0;
    }
  
    // preload() {
    //     this.load.image('gameover_bg', 'assets/background1.png');
    //     // 加载音效资源
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
            'gameover_bg'
        )
        .setOrigin(0.5)
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  
        let goText = {
            fontFamily: 'Arial',
            fontSize: '60px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        };
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 4,
            'GAME OVER',
            goText
        ).setOrigin(0.5);
  
        let statStyle = {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#ffffff'
        };
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 60,
            `Score: ${this.finalScore}\nTime: ${this.finalTime}s`,
            statStyle
        ).setOrigin(0.5);
  
        let btnStyle = {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#fff',
            backgroundColor: '#b58900',
            padding: { x: 20, y: 10 },
            align: 'center'
        };
        let retryBtn = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 60,
            'TRY AGAIN',
            btnStyle
        ).setOrigin(0.5).setInteractive();
  
        retryBtn.on('pointerover', () => {
            this.sound.play('sfx-selection');
            retryBtn.setScale(1.05);
        });
        retryBtn.on('pointerout', () => {
            retryBtn.setScale(1);
        });
        retryBtn.on('pointerdown', () => {
            this.sound.play('sfx-confirm');
            this.scene.start('Gameplay');
        });
  
        let menuBtn = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 140,
            'MAIN MENU',
            btnStyle
        ).setOrigin(0.5).setInteractive();
  
        menuBtn.on('pointerover', () => {
            this.sound.play('sfx-selection');
            menuBtn.setScale(1.05);
        });
        menuBtn.on('pointerout', () => {
            menuBtn.setScale(1);
        });
        menuBtn.on('pointerdown', () => {
            this.sound.play('sfx-confirm');
            this.scene.start('MainMenu');
        });
  
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 60,
            'Created by Junyao\nThanks for playing!',
            { fontFamily: 'Arial', fontSize: '24px', color: '#ddd', align: 'center' }
        ).setOrigin(0.5);
    }
}
