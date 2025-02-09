class Gameplay extends Phaser.Scene {
    constructor() {
        super("Gameplay");
    }
  
    preload() {
        // 背景
        this.load.image('game_bg', 'assets/background1.png');
        // 平台
        this.load.image('platform', 'assets/platform.png');
  
        // 篮子(4帧动画)
        this.load.spritesheet('basketSheet', 'assets/basket-Sheet.png', {
            frameWidth: 32,
            frameHeight: 32
        });
  
        // 各种掉落物
        this.load.image('apple', 'assets/apple.png');
        this.load.image('banana', 'assets/banana.png');
        this.load.image('orange', 'assets/orange.png');
        this.load.image('watermelon', 'assets/watermelon.png');
        this.load.image('strawberry', 'assets/strawberry.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('stone', 'assets/falling stone.png');
        this.load.image('extraBasket', 'assets/basket.png');
  
        // 落叶
        this.load.image('leaf', 'assets/leaf.png');
    }
  
    create() {
        // ========== 基本参数 ==========
        this.gameWidth  = this.cameras.main.width;
        this.gameHeight = this.cameras.main.height;
  
        this.score        = 0;   // 接到水果记分
        this.missedFruits = 0;   // 漏接水果计数
        this.basketCount  = 3;   // 篮子数量
        this.timeElapsed  = 0;   // 游戏时长
  
        // 下落速度控制
        this.baseFallSpeed  = 100; // 初始下落速度
        this.speedIncrement = 1;   // 每秒增加多少下落速度
  
        // ========== 背景 ==========
        this.bg = this.add.image(
            this.gameWidth / 2,
            this.gameHeight / 2,
            'game_bg'
        )
        .setOrigin(0.5)
        .setDisplaySize(this.gameWidth, this.gameHeight);
  
        // 启用物理边界
        this.physics.world.setBounds(0, 0, this.gameWidth, this.gameHeight);
  
        // ========== 平台 (只给篮子使用) ==========
        // 放在底部上方 80px
        this.platform = this.physics.add.staticSprite(
            this.gameWidth / 2,
            this.gameHeight - 80,  
            'platform'
        );
        this.platform.setDisplaySize(this.gameWidth, 40);
  
        // ========== 4帧篮子动画 ==========
        // 0->1->2->3 (开 -> 关)
        this.anims.create({
            key: 'basket_closing',
            frames: this.anims.generateFrameNumbers('basketSheet', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
        // 3->2->1->0 (关 -> 开)
        this.anims.create({
            key: 'basket_opening',
            frames: this.anims.generateFrameNumbers('basketSheet', { start: 3, end: 0 }),
            frameRate: 10,
            repeat: 0
        });
  
        // ========== 玩家篮子 ==========
        // 先创建篮子，再根据平台位置调整其 Y 坐标使其贴合平台
        this.basket = this.physics.add.sprite(this.platform.x, this.platform.y, 'basketSheet');
        this.basket.setScale(2);
        this.basket.setFrame(0);
        this.isBasketClosed = false;
        // 设置碰撞体积（图像原始尺寸为32x32，放大2倍后为64x64）
        this.basket.body.setSize(64, 64);
        this.basket.setCollideWorldBounds(true);
        this.basket.setBounce(0);
        this.physics.add.collider(this.basket, this.platform);
  
        // 计算平台上边界位置以及篮子半高，使篮子正好坐落在平台上
        let basketHalfHeight = this.basket.displayHeight / 2;
        let platformTop = this.platform.y - (this.platform.displayHeight / 2);
        this.basket.y = platformTop - basketHalfHeight;
  
        // ========== 输入控制 ==========
        // 鼠标移动 => 控制篮子 X 坐标（限制在屏幕内）
        this.input.on('pointermove', (pointer) => {
            this.basket.x = Phaser.Math.Clamp(pointer.x, 40, this.gameWidth - 40);
        });
        // 左键点击 => 开合篮子
        this.input.on('pointerdown', () => {
            this.toggleBasketLid();
        });
  
        // 空格短/长按跳跃
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spaceDownTime = 0;
        this.spaceKey.on('down', () => {
            this.spaceDownTime = this.time.now;
        });
        this.spaceKey.on('up', () => {
            let pressDuration = this.time.now - this.spaceDownTime;
            let maxVelocity   = 700;
            let jumpVelocity  = Math.min(pressDuration * 0.5, maxVelocity);
            this.basket.setVelocityY(-jumpVelocity);
        });
  
        // ========== 各种下落物组 ==========
        this.fruitGroup       = this.physics.add.group();
        this.bombGroup        = this.physics.add.group();
        this.stoneGroup       = this.physics.add.group();
        this.extraBasketGroup = this.physics.add.group();
  
        // 篮子 与 各类物体的重叠检测
        this.physics.add.overlap(this.basket, this.fruitGroup,       this.handleCatchFruit,          null, this);
        this.physics.add.overlap(this.basket, this.bombGroup,        this.handleBombCollision,       null, this);
        this.physics.add.overlap(this.basket, this.stoneGroup,       this.handleStoneCollision,      null, this);
        this.physics.add.overlap(this.basket, this.extraBasketGroup, this.handleExtraBasketCollision, null, this);
  
        // ========== 屏幕底部的 "bottomLine" ==========
        this.bottomLine = this.physics.add.staticSprite(
            this.gameWidth / 2,
            this.gameHeight + 20,
            null
        );
        this.bottomLine.displayWidth = this.gameWidth;
        this.bottomLine.displayHeight = 1;
        this.bottomLine.setVisible(false);
        this.bottomLine.setImmovable(true);
        this.bottomLine.body.allowGravity = false;
  
        // 水果穿过平台到底部后的处理：弹跳+缩小后销毁，并计入漏接
        this.physics.add.collider(this.fruitGroup, this.bottomLine, (fruit, line) => {
            this.handleMissedFruit();
            fruit.setVelocityY(-200);
            this.tweens.add({
                targets: fruit,
                scale: 0,
                duration: 500,
                onComplete: () => {
                    fruit.destroy();
                }
            });
        });
  
        // 炸弹/陨石/额外篮子碰到底部直接销毁
        this.physics.add.collider(this.bombGroup, this.bottomLine, (bomb) => {
            bomb.destroy();
        });
        this.physics.add.collider(this.stoneGroup, this.bottomLine, (stone) => {
            stone.destroy();
        });
        this.physics.add.collider(this.extraBasketGroup, this.bottomLine, (eb) => {
            eb.destroy();
        });
  
        // ========== 落叶粒子（缩小尺寸） ==========
        let leafParticles = this.add.particles('leaf');
        leafParticles.createEmitter({
            x: { min: 0, max: this.gameWidth },
            y: 0,
            speedY: { min: 30, max: 60 },
            lifespan: 8000,
            quantity: 1,
            frequency: 3000, 
            rotate: { min: 0, max: 180 },
            alpha: { start: 1, end: 0 },
            scale: { start: 0.3, end: 0.1 }
        });
  
        // ========== UI文本 ==========
        this.scoreText  = this.add.text(20, 20, `Score: ${this.score}`,   { fontSize: '32px', fill: '#fff' });
        this.timeText   = this.add.text(20, 60, `Time: 0`,              { fontSize: '32px', fill: '#fff' });
        this.basketText = this.add.text(20, 100, `Basket: ${this.basketCount}`, { fontSize: '32px', fill: '#fff' });
  
        // ========== 定时生成下落物 ==========
        this.time.addEvent({
            delay: 800,  // 每0.8秒生成一个物体
            callback: () => {
                this.spawnFallingObject();
            },
            loop: true
        });
    }
  
    update(time, delta) {
        // 计算游戏进行时间
        this.timeElapsed += (delta / 1000);
        this.timeText.setText(`Time: ${Math.floor(this.timeElapsed)}`);
  
        // 限制篮子X范围（避免超出屏幕）
        this.basket.x = Phaser.Math.Clamp(this.basket.x, 40, this.gameWidth - 40);
  
        // 如果篮子处于平台上（着陆状态），则修正其 Y 坐标使其紧贴平台
        if (this.basket.body.blocked.down || this.basket.body.touching.down) {
            let basketHalfHeight = this.basket.displayHeight / 2;
            let platformTop = this.platform.y - (this.platform.displayHeight / 2);
            this.basket.y = platformTop - basketHalfHeight;
            this.basket.setVelocityY(0);
        }
    }
  
    // ============ 生成随机下落物体 ============
    spawnFallingObject() {
        let xPos = Phaser.Math.Between(50, this.gameWidth - 50);
        let rand = Phaser.Math.Between(1, 100);
        // 下落速度随时间增加
        let curSpeed = this.baseFallSpeed + (this.timeElapsed * this.speedIncrement);
  
        if (rand <= 55) {
            // 大概率生成水果
            let fruitKey = Phaser.Utils.Array.GetRandom(['apple', 'banana', 'orange', 'watermelon', 'strawberry']);
            let fruit = this.fruitGroup.create(xPos, 0, fruitKey);
            fruit.setScale(1.5);  // 放大水果
            fruit.setGravityY(curSpeed);
        } else if (rand <= 75) {
            // 炸弹
            let bomb = this.bombGroup.create(xPos, 0, 'bomb');
            bomb.setScale(1.5);
            bomb.setGravityY(curSpeed + 50);
        } else if (rand <= 90) {
            // 陨石
            let stone = this.stoneGroup.create(xPos, 0, 'stone');
            stone.setScale(1.5);
            stone.setGravityY(curSpeed + 100);
        } else {
            // 额外篮子
            let eb = this.extraBasketGroup.create(xPos, 0, 'extraBasket');
            eb.setScale(1.5);
            eb.setGravityY(curSpeed - 20);
        }
    }
  
    // ============ 开合篮子 ============
    toggleBasketLid() {
        if (!this.isBasketClosed) {
            // 从开到关
            this.basket.play('basket_closing');
            this.basket.once('animationcomplete-basket_closing', () => {
                this.isBasketClosed = true;
                this.basket.setFrame(3);
            });
        } else {
            // 从关到开
            this.basket.play('basket_opening');
            this.basket.once('animationcomplete-basket_opening', () => {
                this.isBasketClosed = false;
                this.basket.setFrame(0);
            });
        }
    }
  
    // ============ 接水果 ============
    handleCatchFruit(basket, fruit) {
        if (!this.isBasketClosed) {
            // 篮子处于打开状态，接到水果加分
            this.score++;
            this.scoreText.setText(`Score: ${this.score}`);
            fruit.destroy();
        } else {
            // 篮子关闭时，视为漏接
            fruit.destroy();
            this.handleMissedFruit();
        }
    }
  
    // ============ 炸弹撞篮子 ============
    handleBombCollision(basket, bomb) {
        if (!this.isBasketClosed) {
            // 盖子打开时，炸弹会炸坏篮子
            bomb.destroy();
            this.breakBasket();
        } else {
            // 盖子关闭时，炸弹反弹
            bomb.setVelocityY(-200);
            bomb.setVelocityX(Phaser.Math.Between(-200,200));
        }
    }
  
    // ============ 陨石撞篮子 ============
    handleStoneCollision(basket, stone) {
        // 无论篮子状态如何，陨石都会砸坏篮子
        stone.destroy();
        this.breakBasket();
    }
  
    // ============ 额外篮子碰撞 ============
    handleExtraBasketCollision(basket, eb) {
        eb.destroy();
        this.basketCount++;
        this.basketText.setText(`Basket: ${this.basketCount}`);
    }
  
    // ============ 漏接水果处理 ============
    handleMissedFruit() {
        this.missedFruits++;
        if (this.missedFruits >= 10) {
            this.breakBasket();
            this.missedFruits = 0;
        }
    }
  
    // ============ 损坏篮子 ============
    breakBasket() {
        this.basketCount--;
        this.basketText.setText(`Basket: ${this.basketCount}`);
  
        if (this.basketCount > 0) {
            // 重新将篮子放置于平台上方
            let basketHalfHeight = this.basket.displayHeight / 2;
            let platformTop = this.platform.y - (this.platform.displayHeight / 2);
            this.basket.setPosition(this.gameWidth / 2, platformTop - basketHalfHeight);
            // 小闪烁效果
            this.tweens.add({
                targets: this.basket,
                alpha: 0.2,
                duration: 100,
                yoyo: true,
                repeat: 5,
                onComplete: () => {
                    this.basket.setAlpha(1);
                }
            });
        } else {
            // 篮子耗尽 -> 游戏结束
            this.scene.start('Gameover', {
                score: this.score,
                time: Math.floor(this.timeElapsed)
            });
        }
    }
  }
  