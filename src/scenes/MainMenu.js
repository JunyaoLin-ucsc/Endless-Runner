class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }
  
    // preload() 部分由 Preloader 统一加载所有资源
  
    create() {
        // 添加背景图像，充满屏幕
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
            alpha: { from: 1, to: 0.95 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
  
        // 按钮配置（与 Tutorial.js 相同）
        let btnConfig = {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#fff',
            backgroundColor: '#008800',
            padding: { x: 20, y: 10 },
            align: 'center'
        };
  
        // 创建按钮文本对象
        // 将文本从 "GAME START" 改为 "PLAY"，并将按钮放置于屏幕正中稍上方
        let playBtn = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,  // 向上移50像素
            'PLAY',
            btnConfig
        )
        .setOrigin(0.5)
        .setInteractive();  // 文本对象自动以自身边界作为交互区域
  
        // 为按钮添加鼠标事件（与 Tutorial.js 一致）
        playBtn.on('pointerover', () => {
            this.sound.play('sfx-selection', { volume: 0.75 });
            playBtn.setScale(1.05);
        });
        playBtn.on('pointerout', () => {
            playBtn.setScale(1);
        });
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
