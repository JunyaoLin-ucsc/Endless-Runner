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
        // 新增：coin 作为磁铁道具
        this.load.image('coin', 'assets/coin.png');
  
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
  
        // 新增：磁铁功能相关，coin存储数量（最大10）
        this.coinCount = 0;
  
        // 下落速度控制参数
        this.baseFallSpeed = 100;  // 初始下落速度（像素/秒）
        // 每 20 秒增加 20 像素/秒
  
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
  
        this.physics.world.setBounds(0, 0, this.gameWidth, this.gameHeight);
  
        // ========== 平台 ==========
        this.platform = this.physics.add.staticSprite(
            this.gameWidth / 2,
            this.gameHeight - 80,
            'platform'
        );
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
        this.basket = this.physics.add.sprite(this.platform.x, this.platform.y, 'basketSheet');
        this.basket.setScale(3);
        this.basket.setFrame(0);
        this.isBasketClosed = false;
        this.basket.body.setSize(16, 16, true);
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
        // 新增：coinGroup 用于磁铁道具
        this.coinGroup = this.physics.add.group();
  
        this.physics.add.overlap(this.basket, this.fruitGroup, this.handleCatchFruit, null, this);
        this.physics.add.overlap(this.basket, this.bombGroup, this.handleBombCollision, null, this);
        this.physics.add.overlap(this.basket, this.stoneGroup, this.handleStoneCollision, null, this);
        this.physics.add.overlap(this.basket, this.extraBasketGroup, this.handleExtraBasketCollision, null, this);
        // 新增：当篮子碰到 coin 时，收集 coin
        this.physics.add.overlap(this.basket, this.coinGroup, this.handleCoinCollision, null, this);
  
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
            this.handleMissedFruit();
            fruit.setVelocityY(0);
            fruit.body.setAllowGravity(false);
            this.time.addEvent({
                delay: 100,
                callback: () => { fruit.destroy(); },
                loop: false
            });
        });
        this.physics.add.collider(this.bombGroup, this.bottomLine, (bomb) => { bomb.destroy(); });
        this.physics.add.collider(this.stoneGroup, this.bottomLine, (stone) => { stone.destroy(); });
        this.physics.add.collider(this.extraBasketGroup, this.bottomLine, (eb) => { eb.destroy(); });
        this.physics.add.collider(this.coinGroup, this.bottomLine, (coin) => { coin.destroy(); });
  
        // ========== 落叶粒子 ==========
        let leafParticles = this.add.particles('leaf');
        leafParticles.createEmitter({
            x: { min: 0, max: this.gameWidth },
            y: 0,
            speedY: { min: 30, max: 80 },
            lifespan: 5000,
            quantity: 1,
            frequency: 500,
            rotate: { min: 0, max: 180 },
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 0.1 },
            gravityY: 100,
            bounce: { min: 0.2, max: 0.5 },
            maxParticles: 30,
        });
  
        // ========== UI文本 ==========
        this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, { fontSize: '32px', fill: '#fff' });
        this.timeText = this.add.text(20, 60, `Time: 0`, { fontSize: '32px', fill: '#fff' });
        this.basketText = this.add.text(20, 100, `Basket: ${this.basketCount}`, { fontSize: '32px', fill: '#fff' });
        this.missedText = this.add.text(20, this.gameHeight - 40, `Missed: ${this.missedFruits}`, { fontSize: '32px', fill: '#fff' });
        // 新增：显示 coin 数量（放在左下角）
        this.coinText = this.add.text(20, this.gameHeight - 80, `Coin: ${this.coinCount}`, { fontSize: '32px', fill: '#fff' });
  
        // ========== 定时生成下落物 ==========
        this.time.addEvent({
            delay: 800,
            callback: () => { this.spawnFallingObject(); },
            loop: true
        });

        // 添加左右边界 hitbox（宽度 1，高度为游戏高度）
        this.leftHitbox = this.physics.add.staticSprite(0, this.gameHeight / 2, null)
            .setDisplaySize(1, this.gameHeight);
        this.leftHitbox.visible = false;
  
        this.rightHitbox = this.physics.add.staticSprite(this.gameWidth, this.gameHeight / 2, null)
            .setDisplaySize(1, this.gameHeight);
        this.rightHitbox.visible = false;
  
        let fallingGroups = [this.fruitGroup, this.bombGroup, this.stoneGroup, this.extraBasketGroup, this.coinGroup];
        fallingGroups.forEach(group => {
            this.physics.add.collider(group, this.leftHitbox, (obj) => {
                if (obj.body && typeof obj.body.setVelocityX === 'function') {
                    obj.body.setVelocityX(0);
                }
            });
            this.physics.add.collider(group, this.rightHitbox, (obj) => {
                if (obj.body && typeof obj.body.setVelocityX === 'function') {
                    obj.body.setVelocityX(0);
                }
            });
        });

        // 新增：监听 E 键，用于激活磁铁效果
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.magnetActive = false;
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
      
        // 限制所有下落物品横向不出界（update中校正）
        let allFalling = [].concat(
            this.fruitGroup.getChildren(),
            this.bombGroup.getChildren(),
            this.stoneGroup.getChildren(),
            this.extraBasketGroup.getChildren(),
            this.coinGroup.getChildren()
        );
        allFalling.forEach(obj => {
            if (obj.x < 0) {
                obj.x = 0;
                if (obj.body && typeof obj.body.setVelocityX === 'function') {
                    obj.body.setVelocityX(0);
                }
            } else if (obj.x > this.gameWidth) {
                obj.x = this.gameWidth;
                if (obj.body && typeof obj.body.setVelocityX === 'function') {
                    obj.body.setVelocityX(0);
                }
            }
        });
      
        // 新增：检测 E 键按下并激活磁铁效果（持续 10 秒）
        if (Phaser.Input.Keyboard.JustDown(this.eKey) && !this.magnetActive && this.coinCount > 0) {
            this.coinCount--;
            this.coinText.setText(`Coin: ${this.coinCount}`);
            this.magnetActive = true;
            // 10秒后关闭磁铁效果
            this.time.delayedCall(10000, () => {
                this.magnetActive = false;
            });
        }
      
        // 新增：如果磁铁效果激活，遍历 fruitGroup 中处于下半屏的水果自动吸附
        if (this.magnetActive) {
            this.fruitGroup.getChildren().forEach(fruit => {
                // 仅对屏幕下半部分的水果进行吸附，并且防止重复处理（用自定义属性 isMagnetized 标记）
                if (fruit.y > this.gameHeight / 2 && !fruit.isMagnetized) {
                    fruit.isMagnetized = true; // 标记该水果已被磁铁处理
                    this.tweens.add({
                        targets: fruit,
                        x: this.basket.x,
                        y: this.basket.y,
                        duration: 500,
                        ease: 'Linear',
                        onComplete: () => {
                            // 吸附到篮子后，算作成功拾取
                            this.handleCatchFruit(this.basket, fruit);
                        }
                    });
                }
            });
        }
    }
  
    spawnFallingObject() {
        let attempts = 0;
        const maxAttempts = 10;
        let margin = 100;
        let xPos;
        let fallingObjects = [].concat(
            this.fruitGroup.getChildren(),
            this.bombGroup.getChildren(),
            this.stoneGroup.getChildren(),
            this.extraBasketGroup.getChildren(),
            this.coinGroup.getChildren()
        );
        do {
            xPos = Phaser.Math.Between(margin, this.gameWidth - margin);
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
        } else if (rand <= 90) {
            type = 'coin';
        } else {
            type = 'fruit';
        }
        
        // 如果篮子数已达到10，则 extraBasket 不掉落，改为 coin
        if (type === 'extraBasket' && this.basketCount >= 10) {
            type = 'coin';
        }
        
        let step = Math.floor(this.timeElapsed / 20);
        let curSpeed = this.baseFallSpeed + (step * 20);
        
        let newObj;
        let fruitKey;
        if (type === 'fruit') {
            fruitKey = Phaser.Utils.Array.GetRandom(['apple', 'banana', 'orange', 'watermelon', 'strawberry']);
            newObj = this.fruitGroup.create(xPos, 0, fruitKey);
        } else if (type === 'bomb') {
            newObj = this.bombGroup.create(xPos, 0, 'bomb');
        } else if (type === 'stone') {
            newObj = this.stoneGroup.create(xPos, 0, 'stone');
        } else if (type === 'extraBasket') {
            newObj = this.extraBasketGroup.create(xPos, 0, 'extraBasket');
        } else if (type === 'coin') {
            newObj = this.coinGroup.create(xPos, 0, 'coin');
        }
        
        // 设置缩放：对于 fruit 类型，如果是 apple、banana、orange、watermelon，则乘以0.75；coin 按 coin 逻辑
        if (type === 'fruit') {
            let baseScale = Phaser.Math.FloatBetween(3, 3.5);
            if (fruitKey === 'apple' || fruitKey === 'banana' || fruitKey === 'orange' || fruitKey === 'watermelon') {
                baseScale *= 0.75;
            }
            newObj.setScale(baseScale);
        } else if (type === 'coin') {
            // 让 coin 的尺寸与西瓜类似，即使用与 fruit 同范围再乘以 0.75
            let coinScale = Phaser.Math.FloatBetween(3, 3.5) * 0.75;
            newObj.setScale(coinScale);
        } else {
            newObj.setScale(Phaser.Math.FloatBetween(3, 3.5));
        }
        
        newObj.rotation = Phaser.Math.FloatBetween(-0.1, 0.1);
        newObj.body.setSize(16, 16, true);
        newObj.body.setVelocityY(curSpeed + Phaser.Math.Between(0, 50));
        newObj.body.setVelocityX(Phaser.Math.Between(-20, 20));
        
        let delay = Phaser.Math.Between(0, 1000);
        this.time.delayedCall(delay, () => {
            newObj.body.setVelocityY(curSpeed + Phaser.Math.Between(0, 50));
        });
        
        if (this.timeElapsed >= 60 && type === 'fruit') {
            let extraFruitCount = Math.min(Math.floor(this.timeElapsed / 60), 5);
            for (let i = 0; i < extraFruitCount; i++) {
                let extraXPos = Phaser.Math.Between(margin, this.gameWidth - margin);
                let extraAttempts = 0;
                while (Math.abs(extraXPos - xPos) < 50 && extraAttempts < 10) {
                    extraXPos = Phaser.Math.Between(margin, this.gameWidth - margin);
                    extraAttempts++;
                }
                let extraFruitKey = Phaser.Utils.Array.GetRandom(['apple', 'banana', 'orange', 'watermelon', 'strawberry']);
                let extraObj = this.fruitGroup.create(extraXPos, 0, extraFruitKey);
                let extraScale = Phaser.Math.FloatBetween(3, 3.5);
                if (extraFruitKey === 'apple' || extraFruitKey === 'banana' || extraFruitKey === 'orange' || extraFruitKey === 'watermelon') {
                    extraScale *= 0.75;
                }
                extraObj.setScale(extraScale);
                extraObj.body.setSize(16, 16, true);
                extraObj.body.setVelocityY(curSpeed + Phaser.Math.Between(0, 50));
                extraObj.body.setVelocityX(Phaser.Math.Between(-20, 20));
            }
        }
        
        if (this.timeElapsed >= 60 && type === 'stone') {
            let extraStoneCount = Math.min(Math.floor(this.timeElapsed / 60), 5);
            for (let i = 0; i < extraStoneCount; i++) {
                let extraXPos = Phaser.Math.Between(margin, this.gameWidth - margin);
                let extraAttempts = 0;
                while (Math.abs(extraXPos - xPos) < 50 && extraAttempts < 10) {
                    extraXPos = Phaser.Math.Between(margin, this.gameWidth - margin);
                    extraAttempts++;
                }
                let extraObj = this.stoneGroup.create(extraXPos, 0, 'stone');
                extraObj.setScale(Phaser.Math.FloatBetween(3, 3.5));
                extraObj.body.setSize(16, 16, true);
                extraObj.body.setVelocityY(curSpeed + Phaser.Math.Between(0, 50));
                extraObj.body.setVelocityX(Phaser.Math.Between(-20, 20));
                extraObj.body.setOffset(extraObj.body.offset.x, extraObj.body.offset.y + 10);
            }
        }
        
        if (type === 'stone') {
            newObj.body.setOffset(newObj.body.offset.x, newObj.body.offset.y + 5);
        }
    }
    
    toggleBasketLid() {
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
        if (this.isBasketClosed) { return; }
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
        fruit.destroy();
    }
    
    handleBombCollision(basket, bomb) {
        if (!this.isBasketClosed) {
            bomb.destroy();
            this.addExplosion(bomb.x, bomb.y);
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
        this.addExplosion(stone.x, stone.y);
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
        if (this.isBasketClosed) { return; }
        eb.destroy();
        this.basketCount++;
        this.basketText.setText(`Basket: ${this.basketCount}`);
    }
    
    handleCoinCollision(basket, coin) {
        coin.destroy();
        if (this.coinCount < 10) {
            this.coinCount++;
            this.coinText.setText(`Coin: ${this.coinCount}`);
        }
    }
    
    handleMissedFruit() {
        this.missedFruits++;
        this.missedText.setText(`Missed: ${this.missedFruits}`);
        if (this.missedFruits >= 15) {
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
    
    // 新增：利用 Graphics API 动态生成爆炸效果（如果需要）
    addExplosion(x, y) {
        // 如果你没有爆炸图片，可以用简单粒子实现
        let explosion = this.add.particles('coin'); // 这里复用 coin 作为简单效果，可替换为其他纹理
        explosion.createEmitter({
            x: x,
            y: y,
            speed: { min: -200, max: 200 },
            scale: { start: 1, end: 0 },
            lifespan: 600,
            blendMode: 'ADD',
            quantity: 20
        });
        this.time.delayedCall(600, () => { explosion.destroy(); });
    }
}
