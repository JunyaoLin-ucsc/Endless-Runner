class Gameplay extends Phaser.Scene {
    constructor() {
        super("Gameplay");
    }
  
    preload() {
        // 背景
        this.load.image('game_bg', 'assets/background1.png');
        // 平台
        this.load.image('platform', 'assets/platform.png');
  
        // 篮子（4帧动画）——原图尺寸 32×32
        this.load.spritesheet('basketSheet', 'assets/basket-Sheet.png', {
            frameWidth: 32,
            frameHeight: 32
        });
  
        // 各种下落物，均为 32×32
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
  
        this.score        = 0;   // 得分
        this.missedFruits = 0;   // 漏接计数
        this.basketCount  = 3;   // 篮子数量
        this.timeElapsed  = 0;   // 游戏时长
  
        // 下落速度控制参数
        this.baseFallSpeed = 100;  // 初始下落速度（像素/秒）
        // 每 20 秒增加 20 像素/秒
  
        // 用于防止 update() 重置篮子位置（例如炸弹弹走后）以及防止破损后重置
        this.ignoreGroundReset = false;
        this.isDamaged = false;
  
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
  
        // ========== 平台 ==========
        // 放置在底部上方 80px处，platform 不做修改，保持原设置
        this.platform = this.physics.add.staticSprite(
            this.gameWidth / 2,
            this.gameHeight - 80,
            'platform'
        );
        // 视觉上平台显示 40 像素高，但物理体宽度与背景 worldbound 一样长（全宽），物理体高度 20 像素
        let platformHitboxWidth = this.gameWidth * 0.8; // 之前的设置
        this.platform.setDisplaySize(this.gameWidth, 40);
        this.platform.refreshBody();
        this.platform.body.setSize(768, 1, true);
  
        // ========== 4帧篮子动画 ==========
        this.anims.create({
            key: 'basket_closing',
            frames: this.anims.generateFrameNumbers('basketSheet', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'basket_opening',
            frames: this.anims.generateFrameNumbers('basketSheet', { start: 3, end: 0 }),
            frameRate: 10,
            repeat: 0
        });
  
        // ========== 玩家篮子 ==========
        // 创建篮子后使其底部与平台上边界对齐
        this.basket = this.physics.add.sprite(this.platform.x, this.platform.y, 'basketSheet');
        // 保持原设置：this.basket.setScale(3) 和 this.basket.y = this.platform.y - 40
        this.basket.setScale(3);
        this.basket.setFrame(0);
        this.isBasketClosed = false;
        
        // 将篮子的物理体固定为 16×16，并自动居中于 sprite 内（不随视觉放大而改变）
        this.basket.body.setSize(16, 16, true);
  
        // 保持原来的篮子初始位置
        this.basket.y = this.platform.y - 40;
  
        this.basket.setCollideWorldBounds(true);
        this.basket.setBounce(0);
        this.physics.add.collider(this.basket, this.platform);
  
        // ========== 输入控制 ==========
        this.input.on('pointermove', (pointer) => {
            this.basket.x = Phaser.Math.Clamp(pointer.x, 40, this.gameWidth - 40);
        });
        this.input.on('pointerdown', () => {
            this.toggleBasketLid();
        });
  
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spaceDownTime = 0;
        this.spaceKey.on('down', () => {
            this.spaceDownTime = this.time.now;
        });
        this.spaceKey.on('up', () => {
            let pressDuration = this.time.now - this.spaceDownTime;
            let maxVelocity = 700;
            let jumpVelocity = Math.min(pressDuration * 0.5, maxVelocity);
            this.basket.setVelocityY(-jumpVelocity);
        });
  
        // ========== 各种下落物组 ==========
        this.fruitGroup = this.physics.add.group();
        this.bombGroup = this.physics.add.group();
        this.stoneGroup = this.physics.add.group();
        this.extraBasketGroup = this.physics.add.group();
  
        this.physics.add.overlap(this.basket, this.fruitGroup, this.handleCatchFruit, null, this);
        this.physics.add.overlap(this.basket, this.bombGroup, this.handleBombCollision, null, this);
        this.physics.add.overlap(this.basket, this.stoneGroup, this.handleStoneCollision, null, this);
        this.physics.add.overlap(this.basket, this.extraBasketGroup, this.handleExtraBasketCollision, null, this);
  
        // ========== 屏幕底部“bottomLine” ==========
        this.bottomLine = this.physics.add.staticSprite(this.gameWidth / 2, this.gameHeight + 150, null);
        this.bottomLine.setDisplaySize(this.gameWidth, 150);
        this.bottomLine.body.setSize(this.gameWidth, 150, true);
        this.bottomLine.refreshBody();
        this.bottomLine.setVisible(false);
        this.bottomLine.setImmovable(true);
        this.bottomLine.body.allowGravity = false;
  
        // 修改：仅对 fruitGroup 的碰撞处理做调整，确保水果掉出后计为漏接
        this.physics.add.collider(this.fruitGroup, this.bottomLine, (fruit) => {
            this.handleMissedFruit();  // 更新漏接计数
            
            // 停止水果的下落，移除重力作用
            fruit.setVelocityY(0);
            fruit.body.setAllowGravity(false);  // 禁止重力
            
            // 延迟销毁水果，确保漏接计数器已经更新
            this.time.addEvent({
                delay: 100,
                callback: () => {
                    fruit.destroy();
                },
                loop: false
            });
        });
        
        
        this.physics.add.collider(this.bombGroup, this.bottomLine, (bomb) => { bomb.destroy(); });
        this.physics.add.collider(this.stoneGroup, this.bottomLine, (stone) => { stone.destroy(); });
        this.physics.add.collider(this.extraBasketGroup, this.bottomLine, (eb) => { eb.destroy(); });
  
        // ========== 落叶粒子 ==========
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
            scale: { start: 0.45, end: 0.15 }
        });
  
        // ========== UI文本 ==========
        this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, { fontSize: '32px', fill: '#fff' });
        this.timeText = this.add.text(20, 60, `Time: 0`, { fontSize: '32px', fill: '#fff' });
        this.basketText = this.add.text(20, 100, `Basket: ${this.basketCount}`, { fontSize: '32px', fill: '#fff' });
        this.missedText = this.add.text(20, this.gameHeight - 40, `Missed: ${this.missedFruits}`, { fontSize: '32px', fill: '#fff' });
  
        // ========== 定时生成下落物 ==========
        this.time.addEvent({
            delay: 800,
            callback: () => { this.spawnFallingObject(); },
            loop: true
        });
    }
  
    update(time, delta) {
        this.timeElapsed += (delta / 1000);
        this.timeText.setText(`Time: ${Math.floor(this.timeElapsed)}`);
        this.basket.x = Phaser.Math.Clamp(this.basket.x, 40, this.gameWidth - 40);
        
        if ((this.basket.body.blocked.down || this.basket.body.touching.down) && !this.ignoreGroundReset && !this.isDamaged) {
            let basketH = this.basket.displayHeight;
            let platformTop = this.platform.y - (this.platform.displayHeight / 2);
            this.basket.y = platformTop - (basketH / 2);
            this.basket.setVelocityY(0);
        }
        this.fruitGroup.getChildren().forEach((fruit) => {
            if (fruit.y > this.gameHeight) {
                this.handleMissedFruit();
                fruit.destroy();
            }
        });
    }
  
    spawnFallingObject() {
        let attempts = 0;
        const maxAttempts = 10;
        let xPos;
        let fallingObjects = [].concat(
            this.fruitGroup.getChildren(),
            this.bombGroup.getChildren(),
            this.stoneGroup.getChildren(),
            this.extraBasketGroup.getChildren()
        );
        do {
            xPos = Phaser.Math.Between(50, this.gameWidth - 50);
            let tempRect = new Phaser.Geom.Rectangle(xPos - 32, 0, 64, 64);
            var overlap = false;
            for (let obj of fallingObjects) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(tempRect, obj.getBounds())) {
                    overlap = true;
                    break;
                }
            }
            attempts++;
        } while (overlap && attempts < maxAttempts);
  
        let rand = Phaser.Math.Between(1, 100);
        let type;
        if (rand <= 35) {
            type = 'fruit';
        } else if (rand <= 60) {
            type = 'bomb';
        } else if (rand <= 80) {
            type = 'stone';
        } else if (rand <= 85) {
            type = 'extraBasket';
        } else {
            type = 'fruit';
        }
  
        let step = Math.floor(this.timeElapsed / 20);
        let curSpeed = this.baseFallSpeed + (step * 20);
  
        let newObj;
        if (type === 'fruit') {
            let fruitKey = Phaser.Utils.Array.GetRandom(['apple','banana','orange','watermelon','strawberry']);
            newObj = this.fruitGroup.create(xPos, 0, fruitKey);
        } else if (type === 'bomb') {
            newObj = this.bombGroup.create(xPos, 0, 'bomb');
        } else if (type === 'stone') {
            newObj = this.stoneGroup.create(xPos, 0, 'stone');
        } else if (type === 'extraBasket') {
            newObj = this.extraBasketGroup.create(xPos, 0, 'extraBasket');
        }
        newObj.setScale(3);
        newObj.body.setSize(16, 16, true);
        newObj.setVelocityY(curSpeed);
  
        // 如果游戏时间超过 100秒，且生成的是水果或陨石，
        // 则额外生成一个同类型下落物，从不同的 x 坐标出现，制造更多难度
        if (this.timeElapsed >= 100 && (type === 'fruit' || type === 'stone')) {
            let extraXPos = Phaser.Math.Between(50, this.gameWidth - 50);
            let extraAttempts = 0;
            while (Math.abs(extraXPos - xPos) < 50 && extraAttempts < 10) {
                extraXPos = Phaser.Math.Between(50, this.gameWidth - 50);
                extraAttempts++;
            }
            let extraObj;
            if (type === 'fruit') {
                let fruitKey = Phaser.Utils.Array.GetRandom(['apple','banana','orange','watermelon','strawberry']);
                extraObj = this.fruitGroup.create(extraXPos, 0, fruitKey);
            } else if (type === 'stone') {
                extraObj = this.stoneGroup.create(extraXPos, 0, 'stone');
            }
            extraObj.setScale(3);
            extraObj.body.setSize(16, 16, true);
            extraObj.setVelocityY(curSpeed);
        }
    }
  
    toggleBasketLid() {
        // 立即切换篮子状态，不等待动画完成
        if (!this.isBasketClosed) {
            this.isBasketClosed = true;
            this.basket.setFrame(3);
            this.basket.play('basket_closing');
        } else {
            this.isBasketClosed = false;
            this.basket.setFrame(0);
            this.basket.play('basket_opening');
        }
    }
  
    handleCatchFruit(basket, fruit) {
        // 无论篮子状态如何，接住水果都算成功接住
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
        fruit.destroy();
    }
  
    handleBombCollision(basket, bomb) {
        if (!this.isBasketClosed) {
            bomb.destroy();
            this.breakBasket();
        } else {
            bomb.setVelocityY(-200);
            bomb.setVelocityX(Phaser.Math.Between(-200,200));
            this.ignoreGroundReset = true;
            this.time.addEvent({
                delay: 500,
                callback: () => { this.ignoreGroundReset = false; },
                loop: false
            });
        }
    }
  
    handleStoneCollision(basket, stone) {
        stone.destroy();
        this.isDamaged = true;
        this.basketCount--;
        this.basketText.setText(`Basket: ${this.basketCount}`);
        this.tweens.add({
            targets: this.basket,
            alpha: 0.2,
            duration: 100,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.basket.setAlpha(1);
                if (this.basketCount <= 0) {
                    this.scene.start('Gameover', {
                        score: this.score,
                        time: Math.floor(this.timeElapsed)
                    });
                }
            }
        });
    }
  
    handleExtraBasketCollision(basket, eb) {
        eb.destroy();
        this.basketCount++;
        this.basketText.setText(`Basket: ${this.basketCount}`);
    }
  
    handleMissedFruit() {
        // 增加漏接计数
        this.missedFruits++;
        
        // 更新 UI 文本
        this.missedText.setText(`Missed: ${this.missedFruits}`);
        
        // 检查是否达到漏接水果的上限
        if (this.missedFruits >= 15) {
            // 超过15次漏接时，结束游戏
            this.scene.start('Gameover', {
                score: this.score,
                time: Math.floor(this.timeElapsed)
            });
        }
    }
  
    breakBasket() {
        this.isDamaged = true;
        this.basketCount--;
        this.basketText.setText(`Basket: ${this.basketCount}`);
        if (this.basketCount > 0) {
            // 仅执行闪烁效果，不重置篮子位置
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
            this.scene.start('Gameover', {
                score: this.score,
                time: Math.floor(this.timeElapsed)
            });
        }
    }
}
