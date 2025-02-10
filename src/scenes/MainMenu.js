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
  
        // 添加标题文本及阴影和淡淡闪烁效果
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
  
        // 定义按钮尺寸
        let btnWidth = 300, btnHeight = 80;
  
        // 创建按钮容器（初始位置以容器的左上角为基准）
        // 此处我们暂时将容器放置于屏幕中央（以后通过调整交互区域实现偏移）
        let buttonContainer = this.add.container(
            this.cameras.main.width / 2 - btnWidth / 2,
            this.cameras.main.height / 2 - btnHeight / 2
        );
  
        // 绘制按钮背景（圆角矩形带白色边框）
        let buttonBg = this.add.graphics();
        buttonBg.fillStyle(0xFF4500, 1);
        buttonBg.fillRoundedRect(0, 0, btnWidth, btnHeight, 15);
        buttonBg.lineStyle(4, 0xffffff, 1);
        buttonBg.strokeRoundedRect(0, 0, btnWidth, btnHeight, 15);
  
        // 创建按钮文字
        let btnTextStyle = {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        };
        let buttonText = this.add.text(btnWidth / 2, btnHeight / 2, "PLAY", btnTextStyle)
                                .setOrigin(0.5);
  
        // 将背景和文字添加到按钮容器中
        buttonContainer.add([buttonBg, buttonText]);
  
        // 设置容器大小
        buttonContainer.setSize(btnWidth, btnHeight);
  
        // 设置交互区域为整个容器（hitArea 坐标默认从 (0,0) 开始）
        buttonContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, btnWidth, btnHeight), Phaser.Geom.Rectangle.Contains);
  
        // 调整 hitArea 的坐标，向右平移 80 像素、向下平移 30 像素
        // 注意：hitArea 是一个 Phaser.Geom.Rectangle 对象，直接修改其 x 和 y 值即可
        buttonContainer.input.hitArea.x += 80;
        buttonContainer.input.hitArea.y += 30;
  
        // 为按钮添加鼠标移入、移出、点击事件
        buttonContainer.on('pointerover', () => {
            this.sound.play('sfx-selection', { volume: 0.75 });
            // 使用 tween 缩放按钮（注意不要修改 hitArea，这里只改变显示效果）
            this.tweens.add({
                targets: buttonContainer,
                scale: 1.05,
                duration: 200,
                ease: 'Linear'
            });
        });
  
        buttonContainer.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scale: 1,
                duration: 200,
                ease: 'Linear'
            });
        });
  
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
