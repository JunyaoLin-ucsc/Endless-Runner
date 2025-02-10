class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }
  
    // preload() 已在 Preloader 中加载资源
  
    create() {
        // 添加背景图像
        this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'menu_bg'
        )
        .setOrigin(0.5)
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  
        // 添加标题文本
        let titleStyle = {
            fontFamily: 'Georgia, serif',
            fontSize: '80px',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        };
        let titleText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 4,
            'Fruity Picker',
            titleStyle
        ).setOrigin(0.5);
        titleText.setShadow(5, 5, 'rgba(0,0,0,0.7)', 10, true, true);
        this.tweens.add({
            targets: titleText,
            alpha: { from: 1, to: 0.9 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
  
        // 创建按钮（直接用文本对象）
        // 为了让按钮区域足够大，我们使用 padding 参数
        let btnStyle = {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '40px',
            color: '#ffffff',
            backgroundColor: '#ff4500', // 背景色可以根据需要调整
            padding: { x: 20, y: 10 },
            align: 'center'
        };
  
        let playBtn = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'PLAY',
            btnStyle
        ).setOrigin(0.5)
         .setInteractive();  // 使用文本自带的交互区域
  
        // 鼠标指针移入时触发 selection 音效并缩放文本
        playBtn.on('pointerover', () => {
            this.sound.play('sfx-selection', { volume: 0.75 });
            playBtn.setScale(1.05);
        });
  
        // 鼠标指针移出时恢复原始缩放
        playBtn.on('pointerout', () => {
            playBtn.setScale(1);
        });
  
        // 按钮按下时触发 confirm 音效并切换场景
        playBtn.on('pointerdown', () => {
            this.sound.play('sfx-confirm', { volume: 0.75 });
            this.scene.start('Tutorial');
        });
  
        // 添加底部版权信息
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 40,
            'Created by Junyao',
            { fontFamily: 'Arial', fontSize: '24px', color: '#dddddd' }
        ).setOrigin(0.5);
    }
}
