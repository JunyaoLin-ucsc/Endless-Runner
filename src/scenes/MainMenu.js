class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    // All shared assets (images, audio, etc.) are loaded in the Preloader scene.

    create() {
        // Add background image (fills screen)
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
        let titleText = this.add.text(this.cameras.main.centerX, this.cameras.main.height / 4, 'Fruity Picker', titleStyle)
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

        // Button parameters
        let btnWidth = 300;
        let btnHeight = 80;
        // Position: center of screen
        let centerX = this.cameras.main.centerX;
        let centerY = this.cameras.main.centerY;

        // Create a container for the button
        let buttonContainer = this.add.container(0, 0);

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

        // Add both to the container
        buttonContainer.add([buttonBg, buttonText]);
        buttonContainer.setSize(btnWidth, btnHeight);

        // Place the container so its center is at (centerX, centerY)
        buttonContainer.setPosition(centerX - btnWidth / 2, centerY - btnHeight / 2);

        // Define a custom hitArea callback that removes container scale from the pointer coordinates.
        // This callback receives (hitArea, x, y, gameObject) where x and y are in world space.
        let customHitCallback = function (hitArea, x, y, gameObject) {
            // Convert the pointer coordinates to local container coordinates.
            // Since we are not translating within the container, subtract its position.
            let localX = x - gameObject.x;
            let localY = y - gameObject.y;
            // Undo any scale applied to the container:
            localX /= gameObject.scaleX;
            localY /= gameObject.scaleY;
            return Phaser.Geom.Rectangle.Contains(hitArea, localX, localY);
        };

        // Set the container's interactive area with the custom callback.
        buttonContainer.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, btnWidth, btnHeight),
            customHitCallback
        );

        // (Optional) Apply a slight flashing tween to the button container.
        this.tweens.add({
            targets: buttonContainer,
            alpha: { from: 1, to: 0.95 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add pointer event handlers on the container.
        buttonContainer.on('pointerover', () => {
            this.sound.play('sfx-selection', { volume: 0.75 });
            this.tweens.add({
                targets: buttonContainer,
                scale: 1.05,
                duration: 200,
                ease: 'Linear'
            });
        });
        buttonContainer.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scale: 1,
                duration: 200,
                ease: 'Linear'
            });
        });
        buttonContainer.on('pointerdown', () => {
            this.sound.play('sfx-confirm', { volume: 0.75 });
            this.scene.start('Tutorial');
        });

        // Add bottom copyright text
        this.add.text(this.cameras.main.centerX, this.cameras.main.height - 40, 'Created by Junyao', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#dddddd'
        }).setOrigin(0.5);
    }
}
