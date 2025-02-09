class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        // Load assets
        this.load.image('background', 'path/to/your/background.png'); // Replace with your main menu background
        this.load.image('button', 'path/to/phaser-button.png'); // Use Phaser's button-like image
    }

    create() {
        // Add background
        this.add.image(540, 960, 'background').setOrigin(0.5, 0.5); // Assuming 1080x1920 resolution

        // Add title text
        this.add.text(540, 400, 'My Game Title', {
            font: '64px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // Add Play button
        const playButton = this.add.image(540, 900, 'button').setInteractive();
        this.add.text(540, 900, 'Play', {
            font: '48px Arial',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        playButton.on('pointerover', () => playButton.setScale(1.1));
        playButton.on('pointerout', () => playButton.setScale(1));
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Add Options button
        const optionsButton = this.add.image(540, 1100, 'button').setInteractive();
        this.add.text(540, 1100, 'Options', {
            font: '48px Arial',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        optionsButton.on('pointerover', () => optionsButton.setScale(1.1));
        optionsButton.on('pointerout', () => optionsButton.setScale(1));
        optionsButton.on('pointerdown', () => {
            this.scene.start('OptionsMenu');
        });

        // Add credits text
        this.add.text(540, 1800, 'Developed by [Your Name]', {
            font: '32px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);
    }
}

// Options Menu Scene for Phaser 3
class OptionsMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsMenu' });
    }

    preload() {
        // Load assets
        this.load.image('background', 'path/to/your/background.png');
        this.load.image('button', 'path/to/phaser-button.png');
    }

    create() {
        // Add background
        this.add.image(540, 960, 'background').setOrigin(0.5, 0.5);

        // Add title text
        this.add.text(540, 400, 'Options', {
            font: '64px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // Add volume control
        let volume = 5; // Initial volume (range: 0 to 10)
        const volumeText = this.add.text(540, 960, `Volume: ${volume}`, {
            font: '48px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        const decreaseButton = this.add.image(400, 960, 'button').setInteractive();
        this.add.text(400, 960, '-', {
            font: '48px Arial',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5, 0.5);
        decreaseButton.on('pointerdown', () => {
            if (volume > 0) volume--;
            volumeText.setText(`Volume: ${volume}`);
        });

        const increaseButton = this.add.image(680, 960, 'button').setInteractive();
        this.add.text(680, 960, '+', {
            font: '48px Arial',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5, 0.5);
        increaseButton.on('pointerdown', () => {
            if (volume < 10) volume++;
            volumeText.setText(`Volume: ${volume}`);
        });

        // Add Back button
        const backButton = this.add.image(540, 1400, 'button').setInteractive();
        this.add.text(540, 1400, 'Back', {
            font: '48px Arial',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5, 0.5);
        backButton.on('pointerover', () => backButton.setScale(1.1));
        backButton.on('pointerout', () => backButton.setScale(1));
        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}

// Export scenes
export { MainMenu, OptionsMenu };
// Main Menu Scene for Phaser 3
class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        // Load assets
        this.load.image('background', 'path/to/your/background.png'); // Replace with your main menu background
        this.load.image('button', 'path/to/phaser-button.png'); // Use Phaser's button-like image
    }

    create() {
        // Add background
        this.add.image(540, 960, 'background').setOrigin(0.5, 0.5); // Assuming 1080x1920 resolution

        // Add title text
        this.add.text(540, 400, 'My Game Title', {
            font: '64px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // Add Play button
        const playButton = this.add.image(540, 900, 'button').setInteractive();
        this.add.text(540, 900, 'Play', {
            font: '48px Arial',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        playButton.on('pointerover', () => playButton.setScale(1.1));
        playButton.on('pointerout', () => playButton.setScale(1));
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Add Options button
        const optionsButton = this.add.image(540, 1100, 'button').setInteractive();
        this.add.text(540, 1100, 'Options', {
            font: '48px Arial',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        optionsButton.on('pointerover', () => optionsButton.setScale(1.1));
        optionsButton.on('pointerout', () => optionsButton.setScale(1));
        optionsButton.on('pointerdown', () => {
            this.scene.start('OptionsMenu');
        });

        // Add credits text
        this.add.text(540, 1800, 'Developed by [Your Name]', {
            font: '32px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);
    }
}

// Options Menu Scene for Phaser 3
class OptionsMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsMenu' });
    }

    preload() {
        // Load assets
        this.load.image('background', 'path/to/your/background.png');
        this.load.image('button', 'path/to/phaser-button.png');
    }

    create() {
        // Add background
        this.add.image(540, 960, 'background').setOrigin(0.5, 0.5);

        // Add title text
        this.add.text(540, 400, 'Options', {
            font: '64px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // Add volume control
        let volume = 5; // Initial volume (range: 0 to 10)
        const volumeText = this.add.text(540, 960, `Volume: ${volume}`, {
            font: '48px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        const decreaseButton = this.add.image(400, 960, 'button').setInteractive();
        this.add.text(400, 960, '-', {
            font: '48px Arial',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5, 0.5);
        decreaseButton.on('pointerdown', () => {
            if (volume > 0) volume--;
            volumeText.setText(`Volume: ${volume}`);
        });

        const increaseButton = this.add.image(680, 960, 'button').setInteractive();
        this.add.text(680, 960, '+', {
            font: '48px Arial',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5, 0.5);
        increaseButton.on('pointerdown', () => {
            if (volume < 10) volume++;
            volumeText.setText(`Volume: ${volume}`);
        });

        // Add Back button
        const backButton = this.add.image(540, 1400, 'button').setInteractive();
        this.add.text(540, 1400, 'Back', {
            font: '48px Arial',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5, 0.5);
        backButton.on('pointerover', () => backButton.setScale(1.1));
        backButton.on('pointerout', () => backButton.setScale(1));
        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}

// Export scenes
export { MainMenu, OptionsMenu };
