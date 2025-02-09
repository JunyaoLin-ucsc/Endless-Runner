class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }
  
    preload() {
        this.load.image('menu_bg', 'assets/background1.png');
    }
  
    create() {
        // 背景
        this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'menu_bg'
        )
        .setOrigin(0.5)
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  
        // 标题
        let titleStyle = {
            fontFamily: 'Arial',
            fontSize: '60px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        };
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 3,
            'Fruity Picker',
            titleStyle
        ).setOrigin(0.5);
  
        // Play 按钮
        let btnStyle = {
            fontFamily: 'Arial',
            fontSize: '50px',
            color: '#ffffff',
            backgroundColor: '#008800',
            padding: { x: 20, y: 10 },
            align: 'center'
        };
        let playBtn = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'PLAY',
            btnStyle
        ).setOrigin(0.5).setInteractive();
  
        playBtn.on('pointerdown', () => {
            this.scene.start('Tutorial');
        });
  
        // 底部标识
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 40,
            'Created by YourName',
            { fontFamily: 'Arial', fontSize: '24px', color: '#dddddd' }
        ).setOrigin(0.5);
    }
  }
  