class Gameover extends Phaser.Scene {
    constructor() {
        super("Gameover");
    }
  
    init(data) {
        this.finalScore = data.score || 0;
        this.finalTime  = data.time || 0;
    }
  
    create() {
        this.input.mouse.enabled = true;
        if (window.bgmSound && window.bgmSound.isPlaying) {
            window.bgmSound.stop();
        }
  
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'gameover_bg')
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
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 4, 'GAME OVER', goText)
            .setOrigin(0.5);
  
        let statStyle = {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#800080'
        };
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 60,
            `Score: ${this.finalScore}\nTime: ${this.finalTime}s`, statStyle)
            .setOrigin(0.5);
  
        let btnStyle = {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#fff',
            backgroundColor: '#008800',
            padding: { x: 20, y: 10 },
            align: 'center'
        };
  
        let retryBtn = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 60, 'TRY AGAIN', btnStyle)
            .setOrigin(0.5)
            .setInteractive();
  
        retryBtn.on('pointerover', () => {
            this.sound.play('sfx-selection', { volume: 0.6 });
            retryBtn.setScale(1.05);
        });
        retryBtn.on('pointerout', () => {
            retryBtn.setScale(1);
        });
        retryBtn.on('pointerdown', () => {
            this.sound.play('sfx-confirm', { volume: 0.6 });
            this.scene.start("Gameplay");
        });
  
        let menuBtn = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 140, 'MAIN MENU', btnStyle)
            .setOrigin(0.5)
            .setInteractive();
  
        menuBtn.on('pointerover', () => {
            this.sound.play('sfx-selection', { volume: 0.6 });
            menuBtn.setScale(1.05);
        });
        menuBtn.on('pointerout', () => {
            menuBtn.setScale(1);
        });
        menuBtn.on('pointerdown', () => {
            this.sound.play('sfx-confirm', { volume: 0.6 });
            this.scene.start("MainMenu");
        });
  
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 60,
            'Created by Junyao\nThanks for playing!', { fontFamily: 'Arial', fontSize: '24px', color: '#ddd', align: 'center' })
            .setOrigin(0.5);
    }
}
