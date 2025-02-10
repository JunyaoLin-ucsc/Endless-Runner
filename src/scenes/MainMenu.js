class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }
  
    // preload() 已在 Preloader 中加载共享资源
  
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
  
        // 按钮参数
        let btnWidth = 300;
        let btnHeight = 80;
        // 期望按钮中心应位于屏幕中点再加偏移（向右80像素、向下30像素）
        let offsetX = 80;
        let offsetY = 30;
        let centerX = this.cameras.main.width / 2 + offsetX;
        let centerY = this.cameras.main.height / 2 + offsetY;
  
        // 创建一个容器作为按钮，容器内的坐标以 (0,0) 为左上角
        let buttonContainer = this.add.container(0, 0);
  
        // 绘制按钮背景：圆角矩形并带白色边框
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
        let buttonText = this.add.text(btnWidth / 2, btnHeight / 2, "PLAY", btnTextStyle).setOrigin(0.5);
  
        // 将背景和文字加入容器
        buttonContainer.add([buttonBg, buttonText]);
  
        // 设定容器的尺寸（用于后续设置交互区域）
        buttonContainer.setSize(btnWidth, btnHeight);
  
        // 将容器的位置设置为使其中心正好位于 centerX, centerY
        buttonContainer.setPosition(centerX - btnWidth / 2, centerY - btnHeight / 2);
  
        // 为容器设置交互区域，区域从容器左上角 (0,0) 开始，大小与容器一致
        buttonContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, btnWidth, btnHeight), Phaser.Geom.Rectangle.Contains);
  
        // （注意：此处容器的显示与交互区域完全一致，不需要单独调整 hitArea）
  
        // 鼠标移入时播放 selection 音效，并做缩放动画
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
  
        // 按钮按下时播放 confirm 音效并切换场景
        buttonContainer.on('pointerdown', () => {
            this.sound.play('sfx-confirm', { volume: 0.75 });
            this.scene.start('Tutorial');
        });
  
        // 为按钮添加淡淡闪烁效果（alpha 在 1 与 0.95 之间缓慢变化）
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
