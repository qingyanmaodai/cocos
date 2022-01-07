

cc.Class({
    extends: cc.Component,
    // 声明node，使cocos不同组件关联起来可以用于js
    properties: {
        bg_1:cc.Node,
        bg_2:cc.Node,
        gameReady:cc.Node,
        gamePlaying:cc.Node,
        gamePause:cc.Node,
        gameOver:cc.Node,
        hero:cc.Node,
        pre_bullet:cc.Prefab,
        pre_enemy_1:cc.Prefab,
        pre_enemy_2:cc.Prefab,
        pre_enemy_3:cc.Prefab,
        lab_score:cc.Label,
        lab_bestScore:cc.Label,
    },

    // 加载界面，用js将bg1的y轴设置0，bg2在bg1上方
    onLoad () {
        // 生成一个全局的，令每个js脚本都能用到这个game
        window.game = this
        
        // 开启碰撞检测系统，未开启时无法检测
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;

        // 设置布尔值控制背景移动
        this.isBgMove = false
        this.bg_1.y = 0
        this.bg_2.y = this.bg_1.y + this.bg_1.height
        this.setTouch()
        this.gameReady.active = true
        this.gamePlaying.active = false
        this.gamePause.active = false
        this.gameOver.active = false
        // 设置层级，让暂停界面显示在飞机以及子弹上面
        this.gamePause.zIndex = 2
        this.gameOver.zIndex = 2
        // 设置一个变量，控制子弹生成时间
        this.bulletTime = 0
        // 设置一个变量，控制敌机生成时间
        this.enemyTime = 0
        // 创建对象池
        this.bulletPool = new cc.NodePool();
        // 声明一个值控制每个阶段时子弹生成不生成 0:ready,1:playing,2:pause,3:over
        this.bulletType = 0
        this.enemyPool_1 = new cc.NodePool();
        this.enemyPool_2 = new cc.NodePool();
        this.enemyPool_3 = new cc.NodePool();
        // 设置一个数组控制每种敌机生成概率
        this.randomNum = [60,85,100]
        // 声明一个控制分数的变量
        this.scoreNum = 0
        // 声明控制最高分数的变量
        this.bestScoreNum = 0
        // 让一开始分数为0
        this.addScore(0)
        

    },
    // 添加触摸事件并让加载时执行此函数，this.node相当于整个画布
    setTouch:function() {
        // 当手指触点落在目标节点区域内时
        this.node.on("touchstart", function (event) {
            this.gameReady.active = false;
            this.gamePlaying.active = true;
            this.isBgMove = true;
            if (this.bulletType == 0) {
                this.bulletType = 1
            }
            
            // console.log("touchstart");
          }, this);
        // 当手指在屏幕上移动时
        this.node.on("touchmove", function (event) {
            // console.log("touchmove");
            // 声明两个变量，第一个是获取当前飞机的坐标，第二个距离上一次移动的的xy值
            var pos_hero = this.hero.getPosition()
            var pos_move = event.getDelta()
            // 设置飞机最终边界
            var pos_end = cc.Vec2(pos_hero.x + pos_move.x,pos_hero.y + pos_move.y)
            if (pos_end.x < -290) {
                pos_end.x = -290
            }else if(pos_end.x > 290){
                pos_end.x = 290
            }
            if (pos_end.y < -533) {
                pos_end.y = -533
            }else if(pos_end.y > 533){
                pos_end.y = 533
            }
            //设置飞机的坐标为这次获取的坐标加上上一次移动的坐标为本次移动的坐标
            this.hero.setPosition(pos_end)
            // console.log(pos_move);
          }, this);
        // 当手指在目标节点区域内离开屏幕时，准备界面隐藏，游戏界面呈现
        this.node.on("touchend", function (event) {
            // console.log("touchend");
          }, this);
    },
    // 设置不同按钮，传参进去看为哪个执行哪个
    clickBtn:function(sender,str){
        if (str == "pause") {
            this.bulletType = 2
            this.gamePause.active = true
        }else if(str == "continue"){
            this.bulletType = 1
            this.gamePause.active = false
        }else if(str == "replay"){
            this.scoreNum = 0
            this.addScore(0)
            this.bulletType = 1
            this.gamePause.active = false
            this.gameOver.active = false
            this.RemoveAllBullet()
            this.RemoveAllEnemy()
            // 设置初始位置
            this.hero.setPosition(cc.Vec2(0,-365))
            // 获取hero脚本，假如存在执行初始值,让飞机重新产生
            let js = this.hero.getComponent('hero')
            if (js) {
                js.init()
            }
        }else if(str == "backHome"){
            this.scoreNum = 0
            this.addScore(0)
            this.bulletType = 0
            this.gamePause.active = false
            this.gameOver.active = false
            this.gameReady.active = true
            this.gamePlaying.active = false
            this.RemoveAllBullet()
            this.RemoveAllEnemy()
            this.hero.setPosition(cc.Vec2(0,-365))
            // 获取hero脚本，假如存在执行初始值让飞机重新产生
            let js = this.hero.getComponent('hero')
            if (js) {
                js.init()
            }
        }
    },
    // 声明一个分数的函数
    addScore:function (score) {
        this.scoreNum = this.scoreNum + score
        this.lab_score.string = this.scoreNum
        if (this.scoreNum > this.bestScoreNum) {
            this.bestScoreNum = this.scoreNum
        }
        this.lab_bestScore.string = this.bestScoreNum
    },
    // 开启gameover界面的函数
    gameEnd:function () {
        this.gameOver.active = true
        this.gamePause.active = false
    },
    // 设置一个函数用于背景一直循环，两个背景bg在上面，一起向下移动，bg1移动到一定值（bg1的高度）返回bg2上方，bg2同理
    setBg:function(){
        this.bg_1.y = this.bg_1.y - 2
        this.bg_2.y = this.bg_2.y - 2
        if (this.bg_1.y <= -this.bg_1.height) {
            this.bg_1.y =this.bg_2.y + this.bg_1.height
        }
        if (this.bg_2.y <= -this.bg_1.height) {
            this.bg_2.y =this.bg_1.y + this.bg_1.height
        }
    },
    createBullet:function(){
        let bullet = null;
        if (this.bulletPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bullet = this.bulletPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            bullet = cc.instantiate(this.pre_bullet);
        }
        bullet.parent = this.node //将子弹加载到画布上
        // 获取飞机位置
        let pos = this.hero.getPosition()
        // 设置子弹发射位置，设置在飞机头部处发射
        bullet.setPosition(cc.Vec2(pos.x,pos.y + this.hero.height / 2 + 5))
    },
    createEnemy:function(enemyType){
        let enemy = null;
        // 定义一个str控制敌机初始状态
        let str = ''
        let pos_enemy = cc.Vec2(0,0)
        if (enemyType == 1) {
            //创建敌机1
            if (this.enemyPool_1.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                enemy = this.enemyPool_1.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                enemy = cc.instantiate(this.pre_enemy_1);
            }
            str = 'enemy_1'
            // 在canvas上测试每个飞机产生随机数
            pos_enemy.x = -320 + Math.random()*640
            pos_enemy.y = 666 + Math.random()*200
            // 控制后面js变化的是哪个敌机
        }else if(enemyType == 2){
            //生成敌机2
            if (this.enemyPool_2.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                enemy = this.enemyPool_2.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                enemy = cc.instantiate(this.pre_enemy_2);
            }
            str = 'enemy_2'
            pos_enemy.x = -320 + Math.random()*640
            pos_enemy.y = 666 + Math.random()*200
        }else if(enemyType == 3){
            //生成敌机3
            if (this.enemyPool_3.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                enemy = this.enemyPool_3.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                enemy = cc.instantiate(this.pre_enemy_3);
            }
            str = 'enemy_3'
            pos_enemy.x = -300 + Math.random()*600
            pos_enemy.y = 740 + Math.random()*200
        }
        enemy.parent = this.node //将敌机加载到画布上
        // 定义一个js变量使敌机开始时执行原来的画面
        var js = enemy.getComponent(str)
        // 由于回到对象池里面飞机改变的参数保存了进去,所以新产生的对象是爆炸状态
        if (js) {
            js.init()
        }
        enemy.setPosition(pos_enemy)
    },
    // 回收对象
    onBulletKilled: function (bullet) {
        this.bulletPool.put(bullet);
    },
    onEnemyKilled: function (enemy,enemyType) {
        if (enemyType == 1) {
            this.enemyPool_1.put(enemy);
        }else if(enemyType == 2){
            this.enemyPool_2.put(enemy);
        }else if(enemyType == 3){
            this.enemyPool_3.put(enemy);
        }
        
    },
    // 删除子弹
    RemoveAllBullet: function () {
        // 相当于画布下面所有的子节点
        var children = this.node.children
        // 遍历下面子节点
        for (let i = children.length - 1; i >= 0; i--) {
            // 获得这个子节点上面的组件bullet
            const js = children[i].getComponent('bullet')
            if (js) {
                // 如果存在回收子弹
                this.onBulletKilled(children[i])
            }
        }
    },
    RemoveAllEnemy: function () {
        // 相当于画布下面所有的子节点
        var children = this.node.children
        // 遍历下面子节点
        for (let i = children.length - 1; i >= 0; i--) {
            // 获得这个子节点上面的组件bullet
            if (children[i].getComponent('enemy_1')) {
                // 如果存在回收敌机1
                this.onEnemyKilled(children[i],1)
            }else if(children[i].getComponent('enemy_2')) {
                // 如果存在回收敌机2
                this.onEnemyKilled(children[i],2)
            }else if(children[i].getComponent('enemy_3')) {
                // 如果存在回收敌机3
                this.onEnemyKilled(children[i],3)
            }
        }
    },
    // 一直刷新的函数，dt为1/fps 两帧之间的时间间隔 单位是秒
    update (dt) {
        // 雪碧图执行
        if (this.isBgMove) {
            this.setBg()
        }
        // 发射子弹的间隔
        this.bulletTime = this.bulletTime + 1
        if (this.bulletTime == 10){
            this.bulletTime = 0
            if (this.bulletType == 1) {
                this.createBullet()
            }
            
        } 
        this.enemyTime++
        if (this.enemyTime == 90) {
            this.enemyTime = 0
            // 随机产生多只或单只敌机
            let num_random = Math.floor(Math.random()*4) + 1
            for (let i = 0; i < num_random; i++) {
               if (this.bulletType == 1) {//为1是在游戏状态
                // 设置一个变量num来控制敌机生成概率
                let num = Math.random() * 100
                    if (num <= this.randomNum[0]) {
                        this.createEnemy(1)
                    }else if (num <= this.randomNum[1]) {
                        this.createEnemy(2)
                    }else if (num <= this.randomNum[2]) {
                        this.createEnemy(3)
                    }
                
                }
            }
            
        }
        // 测试增加了多少子弹子节点
        console.log(this.node.children.length);
    },
});
