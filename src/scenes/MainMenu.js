class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }
  
    // preload() 已在 Preloader 中加载所有共享资源
  
    create() {
        // 添加背景图像，充满全屏
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'menu_bg')
            .setOrigin(0.5)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  
        // 添加标题文本（居中显示在屏幕上方）
        let titleStyle = {
            fontFamily: 'Georgia, serif',
            fontSize: '80px',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        };
        let titleText = this.add.text(this.cameras.main.centerX, this.cameras.main.height / 4, 'Fruity Picker', titleStyle)
            .setOrigin(0.5);
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
  
        // 使用 Graphics 绘制圆角矩形按钮背景
        let graphics = this.add.graphics();
        graphics.fillStyle(0xFF4500, 1);
        graphics.fillRoundedRect(0, 0, btnWidth, btnHeight, 15);
        graphics.lineStyle(4, 0xffffff, 1);
        graphics.strokeRoundedRect(0, 0, btnWidth, btnHeight, 15);
  
        // 生成纹理后销毁 graphics（避免重复显示）
        graphics.generateTexture('playButtonTexture', btnWidth, btnHeight);
        graphics.destroy();
  
        // 创建按钮背景 Image，交互区域自动与 Image 尺寸一致
        let buttonBg = this.add.image(0, 0, 'playButtonTexture').setOrigin(0.5);
  
        // 创建按钮文字
        let btnTextStyle = {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        };
        let buttonText = this.add.text(0, 0, 'PLAY', btnTextStyle).setOrigin(0.5);
  
        // 将按钮背景和文字组合到一个 Container 中
        let buttonContainer = this.add.container(0, 0, [buttonBg, buttonText]);
  
        // 设置 Container 的尺寸（后续用于调整整体效果）
        buttonContainer.setSize(btnWidth, btnHeight);
  
        // 为 Container 设置交互区域
        // 由于 Image 本身的 hit area 已经准确，此处设置 Container 的 hit area以覆盖中心区域
        buttonContainer.setInteractive(new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight), Phaser.Geom.Rectangle.Contains);
  
        // 将按钮 Container 放置于屏幕正中
        buttonContainer.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
  
        // （提示：若你需要进一步偏移按钮位置，请直接修改上面的 setPosition 参数）
  
        // 添加按钮闪烁效果（alpha 在 1 与 0.95 之间循环变化）
        this.tweens.add({
            targets: buttonContainer,
            alpha: { from: 1, to: 0.95 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
  
        // 鼠标移入时触发 selection 音效并轻微放大
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
  
        // 按钮按下时触发 confirm 音效并切换场景
        buttonContainer.on('pointerdown', () => {
            this.sound.play('sfx-confirm', { volume: 0.75 });
            this.scene.start('Tutorial');
        });
  
        // 底部版权信息
        this.add.text(this.cameras.main.centerX, this.cameras.main.height - 40, 'Created by Junyao', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#dddddd'
        }).setOrigin(0.5);
    }
}
