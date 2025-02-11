class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    create() {
        this.input.mouse.enabled = true;

        if (!window.bgmSound) {
            window.bgmSound = this.sound.add('bgm', { loop: true, volume: 0.65 });
            window.bgmSound.play();
        } else if (!window.bgmSound.isPlaying) {
            window.bgmSound.play();
        }

        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'menu_bg')
            .setOrigin(0.5)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        let titleStyle = {
            fontFamily: 'Georgia, serif',
            fontSize: '80px',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        };
        let titleText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 4, 'Fruity Picker', titleStyle)
            .setOrigin(0.5);
        titleText.setShadow(5, 5, 'rgba(0,0,0,0.7)', 10, true, true);
        this.tweens.add({
            targets: titleText,
            alpha: { from: 1, to: 0.95 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        let btnStyle = {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#fff',
            backgroundColor: '#b58900',
            padding: { x: 20, y: 10 },
            align: 'center'
        };

        let playBtn = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'PLAY', btnStyle)
            .setOrigin(0.5)
            .setInteractive();

        playBtn.on('pointerover', () => {
            this.sound.play('sfx-selection', { volume: 0.6 });
            playBtn.setScale(1.05);
        });
        playBtn.on('pointerout', () => {
            playBtn.setScale(1);
        });
        playBtn.on('pointerdown', () => {
            this.sound.play('sfx-confirm', { volume: 0.6 });
            this.scene.start("Tutorial");
        });

        this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 40,
            'Created by Junyao', { fontFamily: 'Arial', fontSize: '24px', color: '#dddddd' })
            .setOrigin(0.5);
    }
}
