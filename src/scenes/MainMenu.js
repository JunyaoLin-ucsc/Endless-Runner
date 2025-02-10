class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }
  
    preload() {
        this.load.image('menu_bg', 'assets/background1.png');
        // 确保“Press Start 2P”字体通过 CSS 或其他方式加载
    }
  
    create() {
        // 背景图片覆盖全屏
        this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'menu_bg'
        )
        .setOrigin(0.5)
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  
        // 标题文字样式：使用 Georgia 字体、金色填充、黑色描边和阴影
        let titleStyle = {
            fontFamily: 'Georgia, serif',
            fontSize: '80px',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        };
        // 将标题位置上移到屏幕高度的 1/4
        let titleText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 4,
            'Fruity Picker',
            titleStyle
        ).setOrigin(0.5);
        titleText.setShadow(5, 5, 'rgba(0,0,0,0.7)', 10, true, true);
  
        // 为标题添加柔和闪烁效果（alpha 在 1 与 0.9 间缓慢变换）
        this.tweens.add({
            targets: titleText,
            alpha: { from: 1, to: 0.9 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
  
        // PLAY 按钮 —— 使用像素风格字体 "Press Start 2P"
        let btnStyle = {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        };
        let playText = this.add.text(0, 0, 'PLAY', btnStyle).setOrigin(0.5);
  
        // 计算按钮背景尺寸（在文字外加上内边距）
        let paddingX = 20, paddingY = 10;
        let baseBgWidth = playText.width + paddingX * 2;
        let bgHeight = playText.height + paddingY * 2;
        // 背景图形尺寸保持不变
        let bgWidth = baseBgWidth;
  
        // 使用 Graphics 绘制圆角背景
        let btnBg = this.add.graphics();
        btnBg.fillGradientStyle(0xffa500, 0xffa500, 0xff4500, 0xff4500, 1);
        btnBg.fillRoundedRect(0, 0, bgWidth, bgHeight, 10);
  
        // 将背景和文字放入一个容器中，并将文字居中于容器
        let playBtn = this.add.container(
            this.cameras.main.width / 2 - bgWidth / 2,
            this.cameras.main.height / 2 - bgHeight / 2
        );
        playBtn.add([btnBg, playText]);
        playText.setPosition(bgWidth / 2, bgHeight / 2);
  
        // 设置容器的尺寸和交互区域
        playBtn.setSize(bgWidth, bgHeight);
        // 修改：将交互区域（hit area）向右偏移 50 像素、向下偏移 10 像素，
        // 同时宽度增加 20 个像素和高度增加 20 个像素（即背景尺寸的基础上增加 20）
        playBtn.setInteractive(new Phaser.Geom.Rectangle(50, 10, bgWidth + 20, bgHeight + 20), Phaser.Geom.Rectangle.Contains);
  
        // 鼠标悬停时按钮略微放大，同时更新 hit area 保持偏移
        playBtn.on('pointerover', () => {
            this.tweens.add({
                targets: playBtn,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Linear',
                onUpdate: () => {
                    playBtn.input.hitArea.setTo(50, 10, (bgWidth + 20) * playBtn.scaleX, (bgHeight + 20) * playBtn.scaleY);
                }
            });
        });
        playBtn.on('pointerout', () => {
            this.tweens.add({
                targets: playBtn,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Linear',
                onUpdate: () => {
                    playBtn.input.hitArea.setTo(50, 10, (bgWidth + 20) * playBtn.scaleX, (bgHeight + 20) * playBtn.scaleY);
                }
            });
        });
  
        // 点击按钮进入 Tutorial 场景
        playBtn.on('pointerdown', () => {
            this.scene.start('Tutorial');
        });
  
        // 底部版权信息
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 40,
            'Created by Junyao',
            { fontFamily: 'Arial', fontSize: '24px', color: '#dddddd' }
        ).setOrigin(0.5);
    }
}
