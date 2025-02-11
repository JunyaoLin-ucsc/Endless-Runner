class Gameplay extends Phaser.Scene {
    constructor() {
        super("Gameplay");
    }
  
    create() {
        // 禁用鼠标输入，确保只使用键盘控制
        this.input.mouse.enabled = false;
  
        this.gameWidth  = this.cameras.main.width;
        this.gameHeight = this.cameras.main.height;
  
        this.score = 0;
        this.missedFruits = 0;
        this.basketCount = 3;
        this.timeElapsed = 0;
        this.coinCount = 0;
  
        this.baseFallSpeed = 100;
        this.ignoreGroundReset = false;
        this.isDamaged = false;
  
        this.bg = this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'game_bg')
            .setOrigin(0.5)
            .setDisplaySize(this.gameWidth, this.gameHeight);
  
        this.physics.world.setBounds(0, 0, this.gameWidth, this.gameHeight);
  
        this.platform = this.physics.add.staticSprite(this.gameWidth / 2, this.gameHeight - 80, 'platform');
        this.platform.setDisplaySize(this.gameWidth, 40);
        this.platform.refreshBody();
        this.platform.body.setSize(768, 1, true);
  
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
  
        this.basket = this.physics.add.sprite(this.platform.x, this.platform.y, 'basketSheet');
        this.basket.setScale(3);
        this.basket.setFrame(0);
        this.isBasketClosed = false;
        this.basket.body.setSize(16, 16, true);
        this.basket.y = this.platform.y - 40;
        this.basket.setCollideWorldBounds(true);
        this.basket.setBounce(0);
        this.physics.add.collider(this.basket, this.platform);
  
        // 鼠标控制已移除
  
        // 使用空格键控制篮子盖子的开关
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // E 键功能保持不变
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  
        // 初始化键盘控制（A 和 D 键控制篮子左右移动）
        this.initKeyboardControls();
  
        this.fruitGroup = this.physics.add.group();
        this.bombGroup = this.physics.add.group();
        this.stoneGroup = this.physics.add.group();
        this.extraBasketGroup = this.physics.add.group();
        this.coinGroup = this.physics.add.group();
  
        this.physics.add.overlap(this.basket, this.fruitGroup, this.handleCatchFruit, null, this);
        this.physics.add.overlap(this.basket, this.bombGroup, this.handleBombCollision, null, this);
        this.physics.add.overlap(this.basket, this.stoneGroup, this.handleStoneCollision, null, this);
        this.physics.add.overlap(this.basket, this.extraBasketGroup, this.handleExtraBasketCollision, null, this);
        this.physics.add.overlap(this.basket, this.coinGroup, this.handleCoinCollision, null, this);
  
        this.bottomLine = this.physics.add.staticSprite(this.gameWidth / 2, this.gameHeight + 150, null);
        this.bottomLine.setDisplaySize(this.gameWidth, 150);
        this.bottomLine.body.setSize(this.gameWidth, 150, true);
        this.bottomLine.refreshBody();
        this.bottomLine.setVisible(false);
        this.bottomLine.setImmovable(true);
        this.bottomLine.body.allowGravity = false;
  
        this.physics.add.collider(this.fruitGroup, this.bottomLine, (fruit) => {
            this.handleMissedFruit();
            this.sound.play('sfx-failure', { volume: 0.6 });
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
  
        this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, { fontSize: '32px', fill: '#fff' });
        this.timeText = this.add.text(20, 60, `Time: 0`, { fontSize: '32px', fill: '#fff' });
        this.basketText = this.add.text(20, 100, `Basket: ${this.basketCount}`, { fontSize: '32px', fill: '#fff' });
        this.missedText = this.add.text(20, this.gameHeight - 40, `Missed: ${this.missedFruits}`, { fontSize: '32px', fill: '#fff' });
        this.coinText = this.add.text(20, this.gameHeight - 80, `Coin: ${this.coinCount}`, { fontSize: '32px', fill: '#fff' });
        this.magnetText = this.add.text(this.gameWidth - 220, 20, '', { fontSize: '32px', fill: '#fff' });
  
        this.successSound = this.sound.add('sfx-success', { volume: 0.6 });
  
        // 在 Gameplay 开始时重启 bgm：停止前一状态并重启循环播放，音量 0.4
        if (window.bgmSound && window.bgmSound.isPlaying) {
            window.bgmSound.stop();
        }
        window.bgmSound = this.sound.add('bgm', { loop: true, volume: 10 });
        window.bgmSound.play();
  
        this.time.addEvent({
            delay: 800,
            callback: () => { this.spawnFallingObject(); },
            loop: true
        });
    }
  
    initKeyboardControls() {
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        // 初始移动速度设置为 1000 像素/秒
        this.basketSpeed = 1000;
        // 第一次加速在 30 秒后
        this.nextSpeedIncreaseTime = 30;
    }
  
    update(time, delta) {
        let dt = delta / 1000;
        this.timeElapsed += dt;
        this.timeText.setText(`Time: ${Math.floor(this.timeElapsed)}`);
  
        // 每 30 秒增加篮子移动速度，每次增加 90 像素/秒，但在 240 秒后不再增加
        if (this.timeElapsed < 240 && this.timeElapsed >= this.nextSpeedIncreaseTime) {
            this.basketSpeed += 90;
            this.nextSpeedIncreaseTime += 30;
        }
  
        if (this.aKey.isDown) {
            this.basket.x -= this.basketSpeed * dt;
        }
        if (this.dKey.isDown) {
            this.basket.x += this.basketSpeed * dt;
        }
        this.basket.x = Phaser.Math.Clamp(this.basket.x, 40, this.gameWidth - 40);
  
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.toggleBasketLid();
        }
  
        // 始终重置篮子 Y 坐标到平台上
        if (this.basket.body.blocked.down || this.basket.body.touching.down) {
            let basketH = this.basket.displayHeight;
            let platformTop = this.platform.y - (this.platform.displayHeight / 2);
            this.basket.y = platformTop - (basketH / 2);
            this.basket.setVelocityY(0);
        }
  
        this.fruitGroup.getChildren().forEach((fruit) => {
            if (fruit.y > this.gameHeight) {
                this.handleMissedFruit();
                this.sound.play('sfx-failure', { volume: 0.6 });
                fruit.destroy();
            }
        });
      
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
      
        if (Phaser.Input.Keyboard.JustDown(this.eKey) && !this.magnetActive && this.coinCount > 0) {
            this.coinCount--;
            this.coinText.setText(`Coin: ${this.coinCount}`);
            this.magnetActive = true;
            this.magnetEndTime = this.timeElapsed + 10;
            if (this.onSound && this.onSound.isPlaying) {
                this.onSound.stop();
            }
            this.onSound = this.sound.add('sfx-on', { volume: 0.6 });
            this.onSound.play();
        }
      
        if (this.magnetActive) {
            let remaining = Math.ceil(this.magnetEndTime - this.timeElapsed);
            if (remaining <= 0) {
                if (this.offSound && this.offSound.isPlaying) {
                    this.offSound.stop();
                }
                this.offSound = this.sound.add('sfx-off', { volume: 0.6 });
                this.offSound.play();
                this.magnetActive = false;
                this.magnetText.setText('');
            } else {
                this.magnetText.setText(`Magnet: ${remaining}s`);
            }
        } else {
            this.magnetText.setText('');
        }
      
        if (this.magnetActive) {
            this.fruitGroup.getChildren().forEach(fruit => {
                if (fruit.y > this.gameHeight / 2 && !fruit.isMagnetized) {
                    fruit.isMagnetized = true;
                    this.tweens.add({
                        targets: fruit,
                        x: this.basket.x,
                        y: this.basket.y,
                        duration: 500,
                        ease: 'Linear',
                        onComplete: () => {
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
        
        // 每 30 秒增加一次掉落速度，增幅为 10 像素/秒，最多增加到 300 秒（step 最大为 10）
        let step = Math.min(Math.floor(this.timeElapsed / 30), 10);
        let curSpeed = this.baseFallSpeed + (step * 10);
        
        let newObj;
        let fruitKey;
        let type;
        let rand = Phaser.Math.Between(1, 100);
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
        
        if (type === 'extraBasket' && this.basketCount >= 10) {
            type = 'coin';
        }
        if (type === 'coin' && this.coinCount >= 5) {
            type = 'fruit';
        }
        
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
        
        if (type === 'fruit') {
            let baseScale = Phaser.Math.FloatBetween(3, 3.5);
            if (fruitKey === 'apple' || fruitKey === 'banana' || fruitKey === 'orange' || fruitKey === 'watermelon') {
                baseScale *= 0.75;
            }
            newObj.setScale(baseScale);
        } else if (type === 'coin') {
            let coinScale = Phaser.Math.FloatBetween(3, 3.5) * 0.75;
            newObj.setScale(coinScale);
        } else {
            newObj.setScale(Phaser.Math.FloatBetween(3, 3.5));
        }
        
        newObj.rotation = Phaser.Math.FloatBetween(-0.1, 0.1);
        newObj.body.setSize(16, 16, true);
        newObj.body.setVelocityY(curSpeed + Phaser.Math.Between(0, 30));
        newObj.body.setVelocityX(Phaser.Math.Between(-20, 20));
        
        let delay = Phaser.Math.Between(0, 1000);
        this.time.delayedCall(delay, () => {
            newObj.body.setVelocityY(curSpeed + Phaser.Math.Between(0, 30));
        });
        
        if (this.timeElapsed >= 100 && type === 'fruit') {
            let extraFruitCount = Math.min(Math.floor(this.timeElapsed / 100), 2);
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
                extraObj.body.setVelocityY(curSpeed + Phaser.Math.Between(0, 30));
                extraObj.body.setVelocityX(Phaser.Math.Between(-20, 20));
            }
        }
        
        if (this.timeElapsed >= 100 && type === 'stone') {
            let extraStoneCount = Math.min(Math.floor(this.timeElapsed / 100), 2);
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
                extraObj.body.setVelocityY(curSpeed + Phaser.Math.Between(0, 30));
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
    
    playSuccessSound() {
        if (this.successSound.isPlaying) {
            this.successSound.stop();
        }
        this.successSound.play();
    }
    
    handleCatchFruit(basket, fruit) {
        if (!this.magnetActive && this.isBasketClosed) { return; }
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
        this.playSuccessSound();
        fruit.destroy();
    }
    
    handleBombCollision(basket, bomb) {
        if (!this.isBasketClosed) {
            bomb.destroy();
            this.addExplosion(bomb.x, bomb.y);
            this.breakBasket();
        } else {
            // 播放 hit 音效，音量 0.6
            if (this.hitSound && this.hitSound.isPlaying) {
                this.hitSound.stop();
            }
            this.hitSound = this.sound.add('sfx-hit', { volume: 0.6 });
            this.hitSound.play();
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
        // 播放 explosion 音效，音量 0.6
        if (this.explosionSound && this.explosionSound.isPlaying) {
            this.explosionSound.stop();
        }
        this.explosionSound = this.sound.add('sfx-explosion', { volume: 0.6 });
        this.explosionSound.play();
  
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
                let basketH = this.basket.displayHeight;
                let platformTop = this.platform.y - (this.platform.displayHeight / 2);
                this.basket.y = platformTop - (basketH / 2);
                this.isDamaged = false;
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
        this.playSuccessSound();
    }
    
    handleCoinCollision(basket, coin) {
        coin.destroy();
        if (this.coinCount < 5) {
            this.coinCount++;
            this.coinText.setText(`Coin: ${this.coinCount}`);
            this.playSuccessSound();
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
    
    addExplosion(x, y) {
        let explosion = this.add.particles('coin');
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
