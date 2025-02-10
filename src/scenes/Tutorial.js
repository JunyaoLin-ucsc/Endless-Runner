class Tutorial extends Phaser.Scene {
    constructor() {
        super("Tutorial");
    }
  
    preload() {
        this.load.image('tutorial_bg', 'assets/background1.png');
    }
  
    create() {
        // Display full-screen background
        this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'tutorial_bg'
        )
        .setOrigin(0.5)
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  
        // Updated instruction text in English with blue color
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
            color: '#0000FF',  // Blue text
            align: 'left',
            wordWrap: { width: this.cameras.main.width - 80 }
        };
  
        // Center the instructions horizontally; position near the top (at 1/6 of the screen height)
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 6,
            tutorialStr,
            textConfig
        ).setOrigin(0.5, 0);
  
        // Button configuration for starting the game
        let btnConfig = {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#fff',
            backgroundColor: '#008800',
            padding: { x: 20, y: 10 },
            align: 'center'
        };
        let startBtn = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 150,
            'GAME START',
            btnConfig
        ).setOrigin(0.5).setInteractive();
  
        startBtn.on('pointerdown', () => {
            this.scene.start('Gameplay');
        });
    }
}
