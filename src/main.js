let config = {
  type: Phaser.AUTO,
  width: 768,
  height: 1024,
  pixelArt: true,  // 使用高清渲染
  antialias: false,
  resolution: 2,
  scene: [ MainMenu, Tutorial, Gameplay, Gameover ],
  physics: {
      default: 'arcade',
      arcade: {
          debug: true,       // 如需调试可设为 true
          fps: 60,
          gravity: { y: 0 }   // 全局无重力，下落物体采用固定速度
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
       - “一物一生成”逻辑：每个下落物被接或漏接后再生成下一个
       - 随着游戏时长增长，下落物体速度每 20 秒分段加快（无上限），重启时恢复最慢速度
       - 水果、炸弹、陨石及额外篮子随机掉落，且生成时互不重叠
       - 仅鼠标左右控制，Space 实现可变高度跳跃
    2) 视觉亮点:
       - 除背景外，其它图形（篮子、下落物、落叶）按原始尺寸放大 0.5 倍（即乘以 1.5）
       - 但对应的碰撞体（hitbox）保持固定 16×16
       - 平台保持全宽显示（显示高度 40），碰撞体不变
*/
