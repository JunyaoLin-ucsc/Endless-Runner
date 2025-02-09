let config = {
  type: Phaser.AUTO,
  width: 768,
  height: 1024,
  scene: [ MainMenu, Tutorial, Gameplay, Gameover ],
  physics: {
      default: 'arcade',
      arcade: {
          debug: false,       // 若要可视化碰撞体可设 true
          fps: 60,
          gravity: { y: 0 }   // 全局先 0，稍后给篮子单独加
      }
  }
};

let game = new Phaser.Game(config);

/*
  Name: YourName
  Title: Fruity Picker
  Approx. Hours Spent: XX hours

  Creative Tilt:
    1) 技术亮点:
       - “一果一生成”逻辑：每个水果被接或漏接后再生成下一个
       - 最大可用水果数随时间增加
       - 炸弹/陨石/篮子独立随机出现
       - 在底部让水果弹跳+缩小后销毁
       - 仅鼠标左右控制，Space实现可变高度跳跃
    2) 视觉亮点:
       - 放大篮子&水果，平台碰撞准确
       - 秋日风背景 & 落叶粒子
*/
