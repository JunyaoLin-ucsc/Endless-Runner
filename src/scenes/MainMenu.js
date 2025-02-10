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
  
        // 添加标题文本及阴影、淡淡闪烁效果
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
            alpha: { from: 1, to: 0.95 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
  
        // 使用文本对象直接制作按钮
        // 利用 padding 属性扩大按钮区域，确保文字和背景显示一致
        let btnStyle = {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '40px',
            color: '#ffffff',
            backgroundColor: '#FF4500',
            padding: { x: 20, y: 10 },
            align: 'center'
        };
  
        // 计算按钮中心位置
        let btnX = this.cameras.main.width / 2 + 80; // 向右平移80像素
        let btnY = this.cameras.main.height / 2 + 30; // 向下平移30像素
  
        let playBtn = this.add.text(btnX, btnY, 'PLAY', btnStyle)
                              .setOrigin(0.5)
                              .setInteractive();  // 文本对象自动使用自身边界作为 hit area
  
        // 添加淡淡闪烁效果（alpha 在 1 与 0.95 之间缓慢变化）
        this.tweens.add({
            targets: playBtn,
            alpha: { from: 1, to: 0.95 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
  
        // 鼠标移入时播放 selection 音效并稍微放大按钮
        playBtn.on('pointerover', () => {
            this.sound.play('sfx-selection', { volume: 0.75 });
            playBtn.setScale(1.05);
        });
  
        // 鼠标移出时恢复原始大小
        playBtn.on('pointerout', () => {
            playBtn.setScale(1);
        });
  
        // 按钮按下时播放 confirm 音效，并切换到 Tutorial 场景
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
