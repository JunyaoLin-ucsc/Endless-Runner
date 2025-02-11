/*
Name: Junyao Lin
Game Title: Fruity Picker
Approximate Hours Spent: 26 hours

Creative Tilt Justification:
- All audio, music, artwork, backgrounds, and creative elements are entirely my own ideas.
- A key creative feature is the basket’s ability to bounce bombs away when closed, which perfectly leverages Phaser’s Arcade physics system.
- The game also features custom sound effects (including explosion, hit, and magnet on/off) that are carefully managed to avoid overlapping and volume issues.
- I implemented a dynamic falling leaves effect using Phaser’s particle emitter to add atmospheric depth.
- Additionally, I created an explosion spark effect using particle emitters to visually simulate a burst of sparks when the basket is damaged.
- **I also added a magnet attraction effect that draws falling fruits toward the basket when activated—this is the feature I am most proud of!**
- These elements not only demonstrate technical innovation but also contribute to a unique visual style.
*/

window.SFX_VOLUME = 0.35;  // Global SFX volume (if needed)
window.BGM_VOLUME = 0.35;  // Global BGM volume (if needed)

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
  },
  sound: {
    volume: 0.35  // Global default; individual scenes use their own volume settings as needed.
  }
};

let game = new Phaser.Game(config);

