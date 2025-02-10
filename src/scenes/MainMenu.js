class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }
  
    // preload() 已在 Preloader 中加载资源
  
    create() {
        this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'menu_bg'
        )
        .setOrigin(0.5)
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  
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
  
        let btnStyle = {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        };
        let playText = this.add.text(0, 0, 'PLAY', btnStyle).setOrigin(0.5);
        let paddingX = 20, paddingY = 10;
        let baseBgWidth = playText.width + paddingX * 2;
        let bgHeight = playText.height + paddingY * 2;
        let bgWidth = baseBgWidth;
  
        let btnBg = this.add.graphics();
        btnBg.fillGradientStyle(0xffa500, 0xffa500, 0xff4500, 0xff4500, 1);
        btnBg.fillRoundedRect(0, 0, bgWidth, bgHeight, 10);
  
        // 创建容器并将按钮背景和文本添加进去
        let playBtn = this.add.container(
            this.cameras.main.width / 2 - bgWidth / 2,
            this.cameras.main.height / 2 - bgHeight / 2
        );
        playBtn.add([btnBg, playText]);
        playText.setPosition(bgWidth / 2, bgHeight / 2);
  
        // 设置容器大小
        playBtn.setSize(bgWidth, bgHeight);
        // 设置交互区域为整个容器（区域从 (0,0) 开始）
        playBtn.setInteractive(new Phaser.Geom.Rectangle(0, 0, bgWidth, bgHeight), Phaser.Geom.Rectangle.Contains);
  
        // 鼠标移入时播放 selection 音效及缩放动画
        playBtn.on('pointerover', () => {
            this.sound.play('sfx-selection', { volume: 0.75 });
            this.tweens.add({
                targets: playBtn,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Linear'
                // 不再更新 hitArea
            });
        });
  
        playBtn.on('pointerout', () => {
            this.tweens.add({
                targets: playBtn,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Linear'
            });
        });
  
        // 按钮按下时播放 confirm 音效并切换场景
        playBtn.on('pointerdown', () => {
            this.sound.play('sfx-confirm', { volume: 0.75 });
            this.scene.start('Tutorial');
        });
  
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 40,
            'Created by Junyao',
            { fontFamily: 'Arial', fontSize: '24px', color: '#dddddd' }
        ).setOrigin(0.5);
    }
}
