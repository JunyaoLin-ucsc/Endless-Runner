class Tutorial extends Phaser.Scene {
    constructor() {
        super("Tutorial");
    }
  
    preload() {
        this.load.image('tutorial_bg', 'assets/background1.png');
    }
  
    create() {
        // 背景
        this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'tutorial_bg'
        ).setOrigin(0.5)
         .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  
        // 教程文本
        let tutorialStr = 
            "操作说明：\n" +
            "1. 鼠标移动 -> 篮子只在平台上左右移动。\n" +
            "2. 左键点击 -> 开合篮子（4帧动画）。\n" +
            "3. 空格短/长按 -> 实现不同跳跃高度。\n" +
            "4. “一物一生成” -> 每接住/漏接一个下落物后再生成下一个，\n" +
            "   且下落物随机掉落且互不重叠！\n" +
            "5. 炸弹/陨石/额外篮子 -> 随机掉落，误碰会损坏篮子；\n" +
            "   额外篮子可增加篮子数量（概率较低）。\n" +
            "6. 漏接的水果穿过平台后会弹跳+缩小消失，\n" +
            "   漏接10次 -> 损坏1个篮子。篮子耗尽 -> GameOver。\n";
  
        let textConfig = {
            fontFamily: 'Arial',
            fontSize: '26px',
            color: '#ffffff',
            align: 'left',
            wordWrap: { width: this.cameras.main.width - 80 }
        };
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 6,
            tutorialStr,
            textConfig
        ).setOrigin(0.5, 0);
  
        // 开始按钮
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
  