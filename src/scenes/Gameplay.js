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

        // 创建一个全屏幕范围的落叶粒子发射器
        leafParticles.createEmitter({
            x: { min: 0, max: this.gameWidth },  // 在屏幕的宽度范围内随机出现
            y: 0,  // 从屏幕顶部开始
            speedY: { min: 30, max: 80 },  // 设置掉落速度，控制落叶的下落速度
            lifespan: 5000,  // 设置粒子的生命周期为 5 秒
            quantity: 1,  // 每次发射1个粒子
            frequency: 500,  // 每 500 毫秒发射一个粒子（减少密集度）
            rotate: { min: 0, max: 180 },  // 控制叶子的旋转角度
            alpha: { start: 1, end: 0 },  // 使叶子从完全不透明逐渐消失
            scale: { start: 0.5, end: 0.1 },  // 控制叶子的缩放效果
            gravityY: 100,  // 控制重力，使得落叶有一定的下落加速度
            bounce: { min: 0.2, max: 0.5 },  // 设置落叶的反弹效果
            maxParticles: 30,  // 降低最大粒子数（减少总数）
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

        // 添加左侧边界 hitbox（宽度设为20，高度为整个游戏高度）
// 在 create() 方法中添加左右边界 hitbox
// 左边 hitbox：紧贴左边缘，宽度 1，高度为游戏高度
        this.leftHitbox = this.physics.add.staticSprite(0, this.gameHeight / 2, null)
            .setDisplaySize(1, this.gameHeight);
        this.leftHitbox.visible = false;  // 隐藏 hitbox

        // 右边 hitbox：紧贴右边缘
        this.rightHitbox = this.physics.add.staticSprite(this.gameWidth, this.gameHeight / 2, null)
            .setDisplaySize(1, this.gameHeight);
        this.rightHitbox.visible = false;  // 隐藏 hitbox

        // 对所有掉落物品组添加碰撞检测（假设你的掉落物品组分别为 fruitGroup, bombGroup, stoneGroup, extraBasketGroup）
        let fallingGroups = [this.fruitGroup, this.bombGroup, this.stoneGroup, this.extraBasketGroup];

        // 为每个组添加碰撞回调
        fallingGroups.forEach(group => {
            // 与左边 hitbox 碰撞时，将物体水平速度清零
            this.physics.add.collider(group, this.leftHitbox, (fallingObj, hitbox) => {
                if (fallingObj.body && typeof fallingObj.body.setVelocityX === 'function') {
                    fallingObj.body.setVelocityX(0);
                }
            });
            // 与右边 hitbox 碰撞时，将物体水平速度清零
            this.physics.add.collider(group, this.rightHitbox, (fallingObj, hitbox) => {
                if (fallingObj.body && typeof fallingObj.body.setVelocityX === 'function') {
                    fallingObj.body.setVelocityX(0);
                }
            });
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
    
        // 新增：限制所有下落物品的横向运动，不让它们掉出左右边界
        let allFalling = [].concat(
            this.fruitGroup.getChildren(),
            this.bombGroup.getChildren(),
            this.stoneGroup.getChildren(),
            this.extraBasketGroup.getChildren()
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
    }
    
  
    spawnFallingObject() {
        let attempts = 0;
        const maxAttempts = 10;
        // 只限制左右边缘（上下不限制）
        let margin = 100;
        let xPos;
        let fallingObjects = [].concat(
            this.fruitGroup.getChildren(),
            this.bombGroup.getChildren(),
            this.stoneGroup.getChildren(),
            this.extraBasketGroup.getChildren()
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
        } else {
            type = 'fruit';
        }
        
        // 如果篮子数量已达到10，则额外篮子改为水果
        if (type === 'extraBasket' && this.basketCount >= 10) {
            type = 'fruit';
        }
        
        let step = Math.floor(this.timeElapsed / 20);
        let curSpeed = this.baseFallSpeed + (step * 20);
        
        let newObj;
        let fruitKey; // 用于记录生成的水果关键字
        if (type === 'fruit') {
            fruitKey = Phaser.Utils.Array.GetRandom(['apple', 'banana', 'orange', 'watermelon', 'strawberry']);
            newObj = this.fruitGroup.create(xPos, 0, fruitKey);
        } else if (type === 'bomb') {
            newObj = this.bombGroup.create(xPos, 0, 'bomb');
        } else if (type === 'stone') {
            newObj = this.stoneGroup.create(xPos, 0, 'stone');
        } else if (type === 'extraBasket') {
            newObj = this.extraBasketGroup.create(xPos, 0, 'extraBasket');
        }
        
        // 对于 fruit 类型，根据 fruitKey 调整缩放
        if (type === 'fruit') {
            let baseScale = Phaser.Math.FloatBetween(3, 3.5);
            // 如果是 apple、banana、orange、watermelon，则缩小 25%（即乘以 0.75）
            if (fruitKey === 'apple' || fruitKey === 'banana' || fruitKey === 'orange' || fruitKey === 'watermelon') {
                baseScale *= 0.75;
            }
            newObj.setScale(baseScale);
        } else {
            newObj.setScale(Phaser.Math.FloatBetween(3, 3.5));
        }
        
        newObj.rotation = Phaser.Math.FloatBetween(-0.1, 0.1);
        
        // 保持物理碰撞体大小为 16×16（不改变 hitbox）
        newObj.body.setSize(16, 16, true);
        
        // 随机掉落速度和方向
        newObj.body.setVelocityY(curSpeed + Phaser.Math.Between(0, 50));
        newObj.body.setVelocityX(Phaser.Math.Between(-20, 20));
        
        // 不调用 setCollideWorldBounds，允许物体自然掉出屏幕底部
        
        // 随机延迟，确保每个物体掉落时机有差异
        let delay = Phaser.Math.Between(0, 1000);
        this.time.delayedCall(delay, () => {
            newObj.body.setVelocityY(curSpeed + Phaser.Math.Between(0, 50));
        });
        
        // 超过60秒后增加额外水果同时掉落的密度
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
        
        // 超过60秒后增加额外陨石同时掉落的密度
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
                // 将陨石的 hitbox 在 y 方向向下偏移 10 像素
                extraObj.body.setOffset(extraObj.body.offset.x, extraObj.body.offset.y + 10);
            }
        }
        
        // 对于主生成的陨石，也调整 hitbox向下偏移 10 像素
        if (type === 'stone') {
            newObj.body.setOffset(newObj.body.offset.x, newObj.body.offset.y + 5);
        }
    }
    
    
    toggleBasketLid() {
        // 立即切换篮子状态，不等待动画完成
        if (!this.isBasketClosed) {
            this.isBasketClosed = true;
            this.basket.setFrame(3);  // 设置为关闭状态
            this.basket.play('basket_closing');  // 播放关闭动画
        } else {
            this.isBasketClosed = false;
            this.basket.setFrame(0);  // 设置为打开状态
            this.basket.play('basket_opening');  // 播放打开动画
        }
    }
    
  
    handleCatchFruit(basket, fruit) {
        // 检查篮子是否关闭，如果关闭，则不增加得分
        if (this.isBasketClosed) {
            return;  // 如果篮子关闭，直接返回，不做任何处理
        }
    
        // 如果篮子未关闭，才算拾取成功
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
        
        // 销毁水果
        fruit.destroy();
    }
    
  
    handleBombCollision(basket, bomb) {
        if (!this.isBasketClosed) {
            bomb.destroy();
            // 添加炸弹损坏篮子的特效：摄像机震动
            this.cameras.main.shake(300, 0.01);
            this.breakBasket();
        } else {
            bomb.setVelocityY(-200);
            bomb.setVelocityX(Phaser.Math.Between(-200, 200));
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
        // 添加陨石损坏篮子的特效：摄像机震动
        this.cameras.main.shake(300, 0.01);
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
        // 如果篮子处于关闭状态，则不计入拾取成功
        if (this.isBasketClosed) {
            return;  // 直接返回，不执行后续逻辑
        }
        
        // 只有当篮子处于打开状态时才视为拾取成功
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
