class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    // All shared assets (images, audio, etc.) are loaded in the Preloader scene.
    create() {
        // Add background image filling the screen
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'menu_bg')
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
            this.cameras.main.centerX,
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

        // Button parameters
        let btnWidth = 300;
        let btnHeight = 80;
        let centerX = this.cameras.main.centerX;
        let centerY = this.cameras.main.centerY;

        // Create a container for the button and position it so its center is at (centerX, centerY)
        let buttonContainer = this.add.container(centerX - btnWidth / 2, centerY - btnHeight / 2);

        // Draw a rounded rectangle as the button background
        let buttonBg = this.add.graphics();
        buttonBg.fillStyle(0xFF4500, 1);
        buttonBg.fillRoundedRect(0, 0, btnWidth, btnHeight, 15);
        buttonBg.lineStyle(4, 0xffffff, 1);
        buttonBg.strokeRoundedRect(0, 0, btnWidth, btnHeight, 15);

        // Create the button text (centered)
        let btnTextStyle = {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        };
        let buttonText = this.add.text(btnWidth / 2, btnHeight / 2, "PLAY", btnTextStyle)
            .setOrigin(0.5);

        // Add the background and text to the container
        buttonContainer.add([buttonBg, buttonText]);
        buttonContainer.setSize(btnWidth, btnHeight);

        // Define a custom hit area callback that converts world coordinates into local coordinates
        // (this “undoes” any scaling the container might have). For now, our container’s scale is 1.
        let customHitCallback = function(hitArea, x, y, gameObject) {
            let localX = (x - gameObject.x) / gameObject.scaleX;
            let localY = (y - gameObject.y) / gameObject.scaleY;
            return Phaser.Geom.Rectangle.Contains(hitArea, localX, localY);
        };

        // Set the container's interactive area using the custom callback.
        // The hit area is a rectangle starting at (0,0) with width=btnWidth and height=btnHeight.
        buttonContainer.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, btnWidth, btnHeight),
            customHitCallback
        );

        // Add pointer events
        buttonContainer.on('pointerover', () => {
            // Play selection sound at 75% volume
            this.sound.play('sfx-selection', { volume: 0.75 });
            // (If desired, you can add a tween here to slightly scale up the button)
        });
        buttonContainer.on('pointerdown', () => {
            this.sound.play('sfx-confirm', { volume: 0.75 });
            this.scene.start('Tutorial');
        });

        // Add bottom copyright text
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height - 40,
            'Created by Junyao',
            { fontFamily: 'Arial', fontSize: '24px', color: '#dddddd' }
        ).setOrigin(0.5);
    }
}
