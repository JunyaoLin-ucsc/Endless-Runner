class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }
  
    // All shared assets (images, audio, etc.) are loaded in the Preloader scene.
    create() {
        // Add background image (fills the screen)
        this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'menu_bg'
        )
        .setOrigin(0.5)
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  
        // Create title text with a gentle alpha tween
        let titleStyle = {
            fontFamily: 'Georgia, serif',
            fontSize: '80px',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        };
        let titleText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 4,
            'Fruity Picker',
            titleStyle
        ).setOrigin(0.5);
        titleText.setShadow(5, 5, 'rgba(0,0,0,0.7)', 10, true, true);
        this.tweens.add({
            targets: titleText,
            alpha: { from: 1, to: 0.95 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
  
        // Button configuration (exactly the same as in Tutorial.js)
        let btnConfig = {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#fff',
            backgroundColor: '#008800',
            padding: { x: 20, y: 10 },
            align: 'center'
        };
  
        // Create the "GAME START" button text at the same position as in Tutorial.js
        let startBtn = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 150,
            'GAME START',
            btnConfig
        )
        .setOrigin(0.5)
        .setInteractive();
  
        // Add event handlers (matching Tutorial.js)
        startBtn.on('pointerover', () => {
            this.sound.play('sfx-selection');
            startBtn.setScale(1.05);
        });
  
        startBtn.on('pointerout', () => {
            startBtn.setScale(1);
        });
  
        startBtn.on('pointerdown', () => {
            this.sound.play('sfx-confirm');
            this.scene.start('Tutorial');
        });
  
        // Bottom copyright text remains the same
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 40,
            'Created by Junyao',
            { fontFamily: 'Arial', fontSize: '24px', color: '#dddddd' }
        ).setOrigin(0.5);
    }
}
