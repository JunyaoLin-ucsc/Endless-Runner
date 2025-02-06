let config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 1920,
    scene: [ MainMenu, Tutorial, Gameplay, Gameover ]
  }

let game = new Phaser.Game(config)

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3