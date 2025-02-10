let config = {
  type: Phaser.AUTO,
  width: 768,
  height: 1024,
  pixelArt: true, 
  antialias: false,
  resolution: 2,
  scene: [ Preloader, MainMenu, Tutorial, Gameplay, Gameover ],
  physics: {
      default: 'arcade',
      arcade: {
          debug: false, 
          fps: 60,
          gravity: { y: 0 } 
      }
  }
};

let game = new Phaser.Game(config);
