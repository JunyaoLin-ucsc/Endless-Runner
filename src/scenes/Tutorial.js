class Tutorial extends Phaser.Scene {
    constructor() {
        super("Tutorial");
    }

    create() {
        this.input.mouse.enabled = true;
        

        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'tutorial_bg')
            .setOrigin(0.5)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        let tutorialStr =
            "Instructions:\n" +
            "1. Use the A and D keys to move your basket left and right on the platform.\n" +
            "2. Press the SPACE key to open or close the basket's lid. (Only an open basket can catch fruits.)\n" +
            "3. Falling objects (fruits, bombs, stones, extra baskets, and coins) appear continuously; the coins see as magnet, their falling speed increases over time.\n" +
            "4. Bombs and stones will damage your basket if not avoided – each hit costs one basket.\n" +
            "5. Collect extra baskets to gain additional lives and coins to activate the magnet power-up.\n" +
            "6. Press the E key to turn on the magnet, which will attract falling fruits to your basket for 10 seconds. When the effect ends, it turns off.\n" +
            "7. Missing too many fruits will eventually end the game.\n" +
            "Good luck and have fun!";

        let textConfig = {
            fontFamily: 'Arial',
            fontSize: '26px',
            color: '#0000FF',
            align: 'left',
            wordWrap: { width: this.cameras.main.width - 80 }
        };

        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 6, tutorialStr, textConfig)
            .setOrigin(0.5, 0);

        let btnConfig = {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#fff',
            backgroundColor: '#b58900',
            padding: { x: 20, y: 10 },
            align: 'center'
        };

        let startBtn = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 150, 'GAME START', btnConfig)
            .setOrigin(0.5)
            .setInteractive();

        startBtn.on('pointerover', () => {
            this.sound.play('sfx-selection', { volume: 0.75 });
            startBtn.setScale(1.05);
        });
        startBtn.on('pointerout', () => {
            startBtn.setScale(1);
        });
        startBtn.on('pointerdown', () => {
            this.sound.play('sfx-confirm', { volume: 0.75 });
            this.scene.start("Gameplay");
        });
    }
}
