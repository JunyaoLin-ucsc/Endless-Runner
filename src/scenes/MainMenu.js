class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }
  
    // preload() 已由 Preloader 统一加载所有共享资源
  
    create() {
        // 添加背景图像
        this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'menu_bg'
        )
        .setOrigin(0.5)
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  
        // 添加标题文本及阴影和轻微闪烁效果
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
  
        // 按钮参数
        let btnWidth = 300, btnHeight = 80;
  
        // 计算屏幕中心坐标（不做任何额外偏移）
        let centerX = this.cameras.main.width / 2;
        let centerY = this.cameras.main.height / 2;
  
        // 创建一个容器作为按钮，容器坐标设置为使其中心与屏幕中心重合
        let buttonContainer = this.add.container(centerX - btnWidth / 2, centerY - btnHeight / 2);
  
        // 绘制按钮背景（圆角矩形带白色边框）
        let buttonBg = this.add.graphics();
        buttonBg.fillStyle(0xFF4500, 1);
        buttonBg.fillRoundedRect(0, 0, btnWidth, btnHeight, 15);
        buttonBg.lineStyle(4, 0xffffff, 1);
        buttonBg.strokeRoundedRect(0, 0, btnWidth, btnHeight, 15);
  
        // 创建按钮文字，确保文字居中于按钮背景
        let btnTextStyle = {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        };
        let buttonText = this.add.text(btnWidth / 2, btnHeight / 2, "PLAY", btnTextStyle)
                                .setOrigin(0.5);
  
        // 将背景和文字加入容器中
        buttonContainer.add([buttonBg, buttonText]);
  
        // 设置容器尺寸（用于交互区域判断）
        buttonContainer.setSize(btnWidth, btnHeight);
  
        // 设置交互区域为整个容器（区域从 (0,0) 开始，与容器图层完全重合）
        buttonContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, btnWidth, btnHeight), Phaser.Geom.Rectangle.Contains);
  
        // 鼠标移入时播放 selection 音效，并做轻微缩放
        buttonContainer.on('pointerover', () => {
            this.sound.play('sfx-selection', { volume: 0.75 });
            this.tweens.add({
                targets: buttonContainer,
                scale: 1.05,
                duration: 200,
                ease: 'Linear'
            });
        });
  
        // 鼠标移出时恢复原始大小
        buttonContainer.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scale: 1,
                duration: 200,
                ease: 'Linear'
            });
        });
  
        // 按钮按下时播放 confirm 音效并切换到 Tutorial 场景
        buttonContainer.on('pointerdown', () => {
            this.sound.play('sfx-confirm', { volume: 0.75 });
            this.scene.start('Tutorial');
        });
  
        // 为按钮添加一个淡淡的闪烁效果：alpha 在 1 与 0.95 之间缓慢变化
        this.tweens.add({
            targets: buttonContainer,
            alpha: { from: 1, to: 0.95 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
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
